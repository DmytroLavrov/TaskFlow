import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-column-header',
  imports: [],
  templateUrl: './column-header.component.html',
  styleUrl: './column-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColumnHeaderComponent {
  @Input({ required: true }) title!: string;

  @Output() delete = new EventEmitter<void>();

  public onDelete(): void {
    this.delete.emit();
  }
}
