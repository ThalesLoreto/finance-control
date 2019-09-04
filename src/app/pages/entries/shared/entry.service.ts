import { Injectable, Injector } from "@angular/core";

import { Observable } from 'rxjs'
import { flatMap } from 'rxjs/operators'

import { BaseResourceService } from 'src/app/shared/services/base-resource.service';
import { CategoryService } from "../../categories/shared/category.service";
import { Entry } from "./entry.model";

@Injectable({
  providedIn: "root"
})
export class EntryService extends BaseResourceService<Entry>{

  constructor(
    protected injector: Injector,
    private categoryService: CategoryService
  ) {
    super("api/entries", injector, Entry.fromJson)
  }

  create(entry: Entry): Observable<Entry> {
    return this.categoryService.getById(entry.categoryId).pipe(
      flatMap(category => {
        entry.category = category;

        // Return Observable<Entry>
        return super.create(entry);
      })
    )
  }

  update(entry: Entry): Observable<Entry> {
    return this.categoryService.getById(entry.categoryId).pipe(
      flatMap(category => {
        entry.category = category;

        // Return Observable<Entry>
        return super.update(entry);
      })
    )
  }

  // Private Methods

  protected jsonDataToResources(jsonData: any[]): Entry[] {
    const entries: Entry[] = [];

    jsonData.forEach(element => {
      const entry = Entry.fromJson(element);
      entries.push(entry);
    });

    return entries;
  }

  protected jsonDataToResource(jsonData: any): Entry {
    return Entry.fromJson(jsonData);
  }
}
