import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Board, Task } from '@core/models/board.model';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    CdkDropListGroup,
    CdkScrollable,
    CdkDropList,
    CdkDrag,
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
