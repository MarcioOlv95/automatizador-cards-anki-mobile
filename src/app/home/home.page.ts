import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Platform, ToastController } from '@ionic/angular';
import { AutomatizadorCardsAnkiService } from '../services/automatizador-cards-anki.service';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HomePage implements OnInit {
  
  constructor(
    private toastController: ToastController,
    private ankiService: AutomatizadorCardsAnkiService,
    public platform: Platform,
    public storage: Storage
  ) {
  }
  
  newWord: string = null;
  words: any = []
  amountWords: number = 0;
  indexNameInput: number = 1;
  loading: boolean = false;

  ngOnInit(): void {
    this.platform.ready().then( _=> {
      this.storage.get('new-words').then(dados => {
        if (dados != null){
          this.words = dados;
          this.checkAmount();
        } else {
          this.initializeWords()
        }
      }, error => {
        console.log('erro', error)
      })        
    })
  }

  initializeWords() {
    this.words.push({
      value: ""
    })
  }
 
  trackByFn(index: any, item: any) {
    return index;
  }

  addWord(){
    if (this.words[this.words.length-1].value.trim() != "") {
      this.words.push({
        value: ""
      });

      setTimeout(() => {
        console.log(`ion-input-${this.indexNameInput}`)
        document.getElementsByName(`ion-input-${this.indexNameInput}`)[0].focus()
        this.indexNameInput++;
      }, 500);
    }
    this.checkAmount();
  }

  checkAmount(){
    this.amountWords = this.words.filter(x => x.value.trim() != "" && x.value.trim() != null).length;
  }

  removeWord(index: number){
    if (this.words.length == 1){
      this.words[0].value = "";
      this.amountWords = 0;
    } else {
      if (this.words[index].value != "")
        this.amountWords--;

      this.words.splice(index, 1);
    }

    this.checkAmount();
  }

  salvar(){
    this.storage.set('new-words', this.words)
    this.showToast('Dados salvos')
  }

  sincronizar(){
    let body = this.words.map(x => x.value)

    if (this.amountWords > 0){
      this.loading = true;
      this.ankiService.insertCards(body).subscribe(res => {
        this.loading = false;
        if (res.isSuccess){
          this.showToast("Cards inseridos com sucesso!");
          this.storage.remove('new-words')
          this.words = [];
          this.checkAmount();
          this.initializeWords();
          this.indexNameInput = 2;
        } else {
          this.showToast("Houve erro ao fazer a inserção. Detalhe: " + res.errors.find(() => true));
        }
      }, error => {
        this.loading = false;
        this.showToast('Erro ao realizar a sincronização . Detalhe: ' + error.statusText, true)
      })
    }
  }

  async showToast(message: string, error = false) {
    const toast = await this.toastController.create({
      message: message,
      position: 'middle',
      duration: 3000,
      animated: true,
      cssClass: error ? "toastError" : "toastSuccess" 
    });
    toast.present();
  }

}
