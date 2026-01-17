import {
  CdkDragDrop,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { CdkScrollable } from '@angular/cdk/scrolling';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { User } from '@angular/fire/auth';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Board, Column, Task } from '@core/models/board.model';
import { AuthService } from '@core/services/auth.service';
import { BoardService } from '@core/services/board.service';
import { Subject, takeUntil, switchMap, of, tap } from 'rxjs';
import { TaskCardComponent } from './components/task-card/task-card.component';
import { ColumnHeaderComponent } from './components/column-header/column-header.component';

@Component({
  selector: 'app-board',
  imports: [
    CdkDropListGroup,
    CdkScrollable,
    CdkDropList,
    FormsModule,
    TaskCardComponent,
    ColumnHeaderComponent,
  ],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardComponent implements OnInit, OnDestroy {
  private readonly boardService = inject(BoardService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroy$ = new Subject<void>();

  // --- DATA ---
  public currentUser: User | null = null;
  public board: Board = { title: 'Loading...', columns: [] };

  // --- UI STATE ---
  public activeColumnId: string | null = null;
  public isAddingColumn = false;
  public newTaskTitle: string = '';
  public newColumnTitle: string = '';

  // --- TASK EDITING STATE ---
  public editingTaskId: string | null = null;
  public editingTaskTitle: string = '';

  // --- LIFECYCLE ---
  ngOnInit(): void {
    this.authService.user$
      .pipe(
        takeUntil(this.destroy$),
        tap((user) => {
          this.currentUser = user;
          if (!user) {
            this.router.navigate(['/login']);
          }
        }),
        switchMap((user) => {
          if (user) {
            return this.boardService.getBoard(user.uid);
          } else {
            return of(null);
          }
        }),
      )
      .subscribe({
        next: (data) => {
          if (this.currentUser && data !== null) {
            if (data) {
              this.board = data;
            } else {
              this.initDefaultBoard();
            }
            this.cdr.markForCheck();
          }
        },
        error: (err) => {
          console.error('Error loading board:', err);
          if (this.currentUser) {
            this.initDefaultBoard();
          }
          this.cdr.markForCheck();
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // --- AUTH ---

  public async logout(): Promise<void> {
    try {
      await this.authService.logout();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  // --- DRAG & DROP ---

  public drop(event: CdkDragDrop<Task[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
    this.updateBoard(this.board);
  }

  // --- TASKS ---

  public addTask(column: Column): void {
    const title = this.newTaskTitle.trim();
    if (!title) return;

    const newTask: Task = {
      id: this.generateId(),
      title,
    };

    column.tasks.push(newTask);
    this.newTaskTitle = '';
    this.activeColumnId = null;
    this.updateBoard(this.board);
  }

  public deleteTask(columnId: string, taskId: string): void {
    const column = this.board.columns.find((c) => c.id === columnId);
    if (!column) return;

    column.tasks = column.tasks.filter((t) => t.id !== taskId);
    this.updateBoard(this.board);
  }

  public showAddForm(columnId: string): void {
    this.activeColumnId = columnId;
    this.newTaskTitle = '';
  }

  public cancelAdd(): void {
    this.activeColumnId = null;
    this.newTaskTitle = '';
  }

  public startEditTask(task: Task): void {
    this.editingTaskId = task.id;
    this.editingTaskTitle = task.title;
  }

  public saveEditTask(column: Column, task: Task): void {
    if (!this.editingTaskId) return;

    if (!this.editingTaskTitle.trim()) {
      this.deleteTask(column.id, task.id);
    } else {
      task.title = this.editingTaskTitle;
      this.updateBoard(this.board);
    }

    this.editingTaskId = null;
    this.editingTaskTitle = '';
  }

  public cancelEditTask(): void {
    this.editingTaskId = null;
    this.editingTaskTitle = '';
  }

  // --- COLUMNS ---

  public addColumn(): void {
    const title = this.newColumnTitle.trim();
    if (!title) return;

    const newColumn: Column = {
      id: this.generateId(),
      title,
      tasks: [],
    };

    this.board.columns.push(newColumn);
    this.newColumnTitle = '';
    this.isAddingColumn = false;
    this.updateBoard(this.board);
  }

  public deleteColumn(columnId: string): void {
    const column = this.board.columns.find((c) => c.id === columnId);
    if (!column) return;

    const message =
      column.tasks.length > 0
        ? `Delete "${column.title}" with ${column.tasks.length} task(s)?`
        : `Delete "${column.title}"?`;

    if (!confirm(message)) return;

    this.board.columns = this.board.columns.filter((c) => c.id !== columnId);
    this.updateBoard(this.board);
  }

  // --- PRIVATE HELPERS ---

  private initDefaultBoard(): void {
    const defaultBoard: Board = {
      title: 'My First Board',
      columns: [
        { id: this.generateId(), title: 'To Do', tasks: [] },
        { id: this.generateId(), title: 'In Progress', tasks: [] },
        { id: this.generateId(), title: 'Done', tasks: [] },
      ],
    };
    this.updateBoard(defaultBoard);
  }

  private updateBoard(newBoard: Board): void {
    if (!this.currentUser) return;

    this.board = newBoard;
    this.cdr.markForCheck();
    this.boardService
      .saveBoard(this.currentUser.uid, newBoard)
      .catch((err) => console.error('Error saving board:', err));
  }

  private generateId(): string {
    return crypto.randomUUID();
  }
}
