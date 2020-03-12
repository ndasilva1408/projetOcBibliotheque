import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {UserService} from '../../../../services/user.service';
import {User} from '../../../../models/user';
import {TokenStorageService} from '../../../../services/security/token-storage.service';
import {Router} from '@angular/router';
import {BilletService} from '../../../../services/billet.service';
import {BookService} from '../../../../services/book.service';
import {Billet} from '../../../../models/billet';
import {Book} from '../../../../models/book';
import {AuthService} from '../../../../services/security/auth.service';

@Component({
    selector: 'app-my-profil',
    templateUrl: './my-profil.component.html',
    styleUrls: ['./my-profil.component.css']
})
export class MyProfilComponent implements OnInit {

    forms: FormGroup;
    user: User;
    billets: Array<Billet>;
    books: Array<Book>;


    constructor(private userService: UserService, private token: TokenStorageService,
                private router: Router, private billetService: BilletService,
                private bookService: BookService, private authService: AuthService) {
    }

    ngOnInit() {
        this.initProfil(this.token);
        this.initBook();
    }

    private initProfil(token: TokenStorageService) {
        this.userService.getProfil(this.token.getLogin()).subscribe(
            res => {
                this.user = res;
                this.initBillet();
                console.log('user ', res.mail);
            }
        );
    }

    private initBillet() {
        this.billetService.getBorrowsByUserID(this.user.id).subscribe(
            data => {
                this.billets = data;
                this.billets.forEach(billet => {
                    this.books.filter(book => ('' + book.id) === billet.bookId).forEach(book => billet.bookId = book.titre);
                });
            });
    }

    deleteUser(user: User) {
        this.userService.deleteUser(this.user.id).subscribe(
            response => {
            }),
            err => {
                console.log('error: ', err.error.message);
            };

        this.authService.deleteUser(this.user.id).subscribe(
            response => {
                this.token.signOut();
                this.router.navigate(['/home']);
            }),
            err => {
                console.log('error: ', err.error.message);
            };


    }

    private initBook() {
        this.bookService.getBooks().subscribe(
            data => {
                this.books = data;
            }
        );
    }

    extendBorrow(id: number) {
        this.billetService.updateBorrowStatus(id).subscribe(res => {
            this.initBillet();
        });
    }
}


