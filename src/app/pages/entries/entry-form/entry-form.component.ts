import { Component, OnInit, AfterContentChecked } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators
} from "@angular/forms";

import { Entry } from "../shared/entry.model";
import { EntryService } from "../shared/entry.service";

import { Category } from '../../categories/shared/category-model';
import { CategoryService } from '../../categories/shared/category.service';

import { switchMap } from "rxjs/operators";

import toastr from "toastr";

@Component({
  selector: "app-entry-form",
  templateUrl: "./entry-form.component.html",
  styleUrls: ["./entry-form.component.css"]
})
export class EntryFormComponent implements OnInit, AfterContentChecked {
  currentAction: string;
  entryForm: FormGroup;
  pageTitle: string;
  serverErrorMessages: string[] = null;
  submittingForm = false;
  entry: Entry = new Entry();
  categories: Array<Category>;

  imaskConfig = {
    mask: Number,
    scale: 2,
    thousandsSeparator: '',
    padFractionalZeros: true,
    normalizeZeros: true,
    radix: ','
  };

  constructor(
    private entryService: EntryService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private categoryService: CategoryService
  ) {}

  ngOnInit() {
    this.setCurrentAction();
    this.buildEntryForm();
    this.loadEntry();
    this.loadCategories();
  }

  ngAfterContentChecked() {
    this.setPageTitle();
  }

  submitForm() {
    this.submittingForm = true;
    this.currentAction == "new" ? this.createEntry() : this.updateEntry();
  }

  get typeOptions(): Array<any>{
    return Object.entries(Entry.types).map(
      ([value, text]) => {
        return {
          value: value,
          text: text
        }
      }
    );
  }

  // PRIVATE METHODS

  private setCurrentAction() {
    if (this.route.snapshot.url[0].path == "new") {
      this.currentAction = "new";
    } else {
      this.currentAction = "edit";
    }
  }

  private buildEntryForm() {
    this.entryForm = this.formBuilder.group({
      id: [null],
      name: [null, Validators.compose([Validators.required, Validators.minLength(3)])],
      description: [null],
      type: ["expense", Validators.compose([Validators.required])],
      amount: [null, Validators.compose([Validators.required])],
      date: [null, Validators.compose([Validators.required])],
      paid: [true, Validators.compose([Validators.required])],
      categoryId: [null, Validators.compose([Validators.required])]
    });
  }

  private loadEntry() {
    if (this.currentAction == "edit") {
      this.route.paramMap
        .pipe(
          switchMap(params => this.entryService.getById(+params.get("id")))
        )
        .subscribe(
          entry => {
            this.entry = entry;
            this.entryForm.patchValue(entry); // fazendo Bind do conteúdo do Entry para o EntryForm
          },
          erro => alert("ocorreu um erro")
        );
    }
  }

  private loadCategories() {
    this.categoryService.getAll().subscribe(
      categories => this.categories = categories
    );
  }

  private setPageTitle() {
    if (this.currentAction === "new") {
      this.pageTitle = "Cadastro de Novo Lançamento";
    } else {
      const entryName: string = this.entry.name || "";
      this.pageTitle = `Editando Lançamento: ${entryName}`;
    }
  }

  private createEntry() {
    const entry: Entry = Object.assign(new Entry(), this.entryForm.value);

    this.entryService
      .create(entry)
      .subscribe(
        entry => this.actionsForSuccess(entry),
        error => this.actionsForError(error)
      );
  }

  private updateEntry() {
    const entry: Entry = Object.assign(new Entry(), this.entryForm.value);

    this.entryService
      .update(entry)
      .subscribe(
        entry => this.actionsForSuccess(entry),
        error => this.actionsForError(error)
      );
  }

  private actionsForSuccess(entry: Entry) {
    toastr.success("Solicitação processada com sucesso!");

    this.router
      .navigateByUrl("entries", { skipLocationChange: true })
      .then(() => this.router.navigate(["entries", entry.id, "edit"]));
  }

  private actionsForError(error: any) {
    toastr.error("Ocorreu um erro ao processar sua solicitação!");
    this.submittingForm = false;
  }
}
