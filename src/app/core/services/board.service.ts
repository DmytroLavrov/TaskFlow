import { inject, Injectable } from '@angular/core';
import { doc, docData, Firestore, setDoc } from '@angular/fire/firestore';
import { Board } from '@core/models/board.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  private readonly firestore = inject(Firestore);
  private readonly COLLECTION_NAME = 'boards';

  // Get user's board from Firestore
  public getBoard(userId: string): Observable<Board | undefined> {
    const userDocRef = this.getUserDocRef(userId);
    return docData(userDocRef) as Observable<Board | undefined>;
  }

  // Save user's board to Firestore
  public saveBoard(userId: string, board: Board): Promise<void> {
    const userDocRef = this.getUserDocRef(userId);
    return setDoc(userDocRef, board);
  }

  // Get Firestore document reference for a user
  private getUserDocRef(userId: string) {
    return doc(this.firestore, `${this.COLLECTION_NAME}/${userId}`);
  }
}
