import { CdkDrag, CdkDragPlaceholder } from '@angular/cdk/drag-drop';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Task } from '@core/models/board.model';

@Component({
  selector: 'app-task-card',
  imports: [CdkDrag, CdkDragPlaceholder, FormsModule],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskCardComponent {
  @Input({ required: true }) task!: Task;
  @Input() isEditing = false;
  @Input() editingTitle = '';

  @Output() startEdit = new EventEmitter<void>();
  @Output() saveEdit = new EventEmitter<string>();
  @Output() cancelEdit = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();

  public onStartEdit(): void {
    this.startEdit.emit();
  }

  public onSaveEdit(): void {
    this.saveEdit.emit(this.editingTitle);
  }

  public onCancelEdit(): void {
    this.cancelEdit.emit();
  }

  public onDelete(event: Event): void {
    event.stopPropagation();
    this.delete.emit();
  }
}
