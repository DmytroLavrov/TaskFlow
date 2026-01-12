import {
  CdkDrag,
  CdkDragDrop,
  CdkDragPlaceholder,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { Board, Column, Task } from '@core/models/board.model';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    CdkDropListGroup,
    CdkScrollable,
    CdkDropList,
    CdkDrag,
    CdkDragPlaceholder,
    FormsModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  // Initial data
  public board: Board = {
    title: 'Development Board',
    columns: [
      {
        id: 'todo',
        title: 'To Do 📝',
        tasks: [
          { id: '1', title: 'Learn Angular Signals' },
          { id: '2', title: 'Install Angular CDK' },
          { id: '3', title: 'Buy coffee' },
        ],
      },
      {
        id: 'doing',
        title: 'In Progress 🚧',
        tasks: [{ id: '4', title: 'Creating Trello Clone' }],
      },
      {
        id: 'done',
        title: 'Done ✅',
        tasks: [{ id: '5', title: 'Setup Project' }],
      },
    ],
  };

  // Store the column ID where the form is currently open
  // null = not open anywhere
  public activeColumnId: string | null = null;

  // Is the column creation form open?
  public isAddingColumn: boolean = false;

  public newTaskTitle: string = '';
  public newColumnTitle: string = '';

  public showAddForm(columnId: string): void {
    this.activeColumnId = columnId;
    this.newTaskTitle = '';
  }

  public cancelAdd(): void {
    this.activeColumnId = null;
    this.newTaskTitle = '';
  }

  public addTask(column: Column): void {
    if (!this.newTaskTitle.trim()) return;

    const newTask = {
      id: crypto.randomUUID(),
      title: this.newTaskTitle,
    };

    column.tasks.push(newTask);

    this.newTaskTitle = '';
    this.activeColumnId = null;
  }

  public addColumn(): void {
    if (!this.newColumnTitle.trim()) return;

    this.board.columns.push({
      id: crypto.randomUUID(),
      title: this.newColumnTitle,
      tasks: [],
    });

    this.newColumnTitle = '';
    this.isAddingColumn = false;
  }

  public drop(event: CdkDragDrop<Task[]>): void {
    if (event.previousContainer === event.container) {
      // f we drag within one column (change the order)
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    } else {
      // If we drag to another column
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }
}
