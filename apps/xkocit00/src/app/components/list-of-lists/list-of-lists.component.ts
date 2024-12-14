import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ConfiramtionDialogComponent } from '../confiramtion-dialog/confiramtion-dialog.component';
import { ListManagerService } from '../../services/list-manager.service';
import { List } from 'backend';
import { Clipboard } from '@angular/cdk/clipboard';
import {
  CreateListDialogComponent,
  ListDialogData,
} from './create-list-dialog/create-list-dialog.component';
import { ImportListComponent } from './import-list/import-list.component';
import { MatSnackBar } from '@angular/material/snack-bar';

/**
 * Main page component displaying all available shopping lists
 *
 * @author Tomáš Kocí
 */
@Component({
  selector: 'app-list-of-lists',
  templateUrl: './list-of-lists.component.html',
  styleUrl: './list-of-lists.component.css',
})
export class ListOfListsComponent implements OnInit {
  public lists: List[] = [];
  constructor(
    private router: Router,
    private dialog: MatDialog,
    private listManager: ListManagerService,
    private clipboard: Clipboard,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.listManager.availableLists$.subscribe((lists) => {
      this.lists = lists;
    });
    this.listManager.getAllLists();
  }

  public resetList(list: List): void {
    this.dialog
      .open(ConfiramtionDialogComponent, {
        data: {
          header: 'Reset list',
          warning:
            'Are you sure you want to reset the list ' +
            list.listTitle +
            '? All items will be marked as unchecked.',
        },
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.listManager.resetList(list.id);
        }
      });
  }

  public viewList(list: List): void {
    this.router.navigate(['/list', list.id]);
  }

  public deleteList(list: List): void {
    const dialogRef = this.dialog.open(ConfiramtionDialogComponent, {
      data: {
        header: 'Delete list',
        warning:
          'Are you sure you want to delete the list ' + list.listTitle + '?',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.listManager.deleteList(list.id);
      }
    });
  }

  public editList(list: List): void {
    const dialogRef = this.dialog.open(CreateListDialogComponent, {
      width: '350px',
      data: {
        listTitle: list.listTitle,
        listId: list.id,
        isEdit: true,
        existingTitles: this.lists.map((item) => item.listTitle),
      } as ListDialogData,
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        await this.listManager.setListTitle(list.id, result.listTitle);
      }
    });
  }

  public copyList(list: List): void {
    const dialogRef = this.dialog.open(CreateListDialogComponent, {
      data: {
        existingTitles: this.lists.map((item) => item.listTitle),
        isEdit: false,
        isCopy: true,
        listTitle: list.listTitle,
      } as ListDialogData,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.listManager.copyList(list, result.listTitle);
      }
    });
  }

  public shareList(list: List): void {
    this.clipboard.copy(list.code.toString());
    this.snackBar.open('List code copied to clipboard', 'Close', {
      duration: 2000,
    });
  }

  public async addList(): Promise<void> {
    const dialogRef = this.dialog.open(CreateListDialogComponent, {
      width: '350px',
      data: {
        listTitle: 'New List',
        isEdit: false,
        existingTitles: this.lists.map((item) => item.listTitle),
      } as ListDialogData,
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        await this.listManager.createList(result.listTitle);
      }
    });
  }

  public importList(): void {
    const dialogRef = this.dialog.open(ImportListComponent, {
      width: '350px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.listManager.importList(Number(result.uid));
        // Handle the imported list using the UID
      }
    });
  }
}
