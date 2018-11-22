import EmpatiElement from "./Lib/Element";
import { CustomElement, html } from "./Lib/Particles";
import { Execute, MetaManager, ViewManager } from "./Lib/Managers";
import { Event } from "./Lib/Particles/EventParticle";
import { QueryAll } from "./Lib/Particles/QSParticle";



class OarkonElement extends EmpatiElement {
  static Namespace = "oarkon"
}

// [Src, LayerDepth , x width meter , y height meter , scale ratio]
const Layers = [
  ["https://images6.alphacoders.com/697/697050.png", -100, , , 0.008],
  ["http://pngimg.com/uploads/cloud/cloud_PNG30.png", -500 , -200 , -200 , ,.7],
  ["https://i.gifer.com/origin/b0/b0e1845409a98e351151de906e44682c_w200.gif", -500 , 200 , -75 , ,.7],
  ["https://orig00.deviantart.net/20dd/f/2016/288/b/6/cloud_black_by_spazcool-dal2e8r.png", -500 , 300 , -200 , ,.5,],
  ["https://gameartpartners.com/wp-content/uploads/edd/2015/03/Darkness_Knight_Featured.png", 15 , -300 , 10, ],
  ["https://vignette.wikia.nocookie.net/finalfantasy/images/7/77/Zeio_Nut.png/revision/latest?cb=20100531194009", -70 , 0 , 330],
  ["https://vignette.wikia.nocookie.net/villains/images/6/6b/Rigby_character.png/revision/latest?cb=20120708152605", 15 , 300 , 20],

  // ["http://localhost:5500/Images/Group.png", -1 , 1 , 1]
];

type ILayer = {
  Src: string,
  Layer: number,
  X: number,
  Y: number,
  hX:any,
  hY:any,
  scale:any,
  MovementSpeed:any
};

const Hx = window.innerWidth / 2 ;
const Hy = window.innerHeight / 2 ;


@CustomElement
class Main extends OarkonElement {


  @Event("mousemove")
  Paralax(Event: MouseEvent) {
    this.Images.forEach(Img => {
      Img.style.left = ((Hx + Img.Data.hX) - (Event.x - Hx)*(Img.Data.MovementSpeed) - Img.clientWidth / 2) + "px";      
      Img.style.top = ((Hy + Img.Data.hY) - (Event.y - Hy)*(Img.Data.MovementSpeed) - Img.clientHeight / 2) + "px";    
      
    });

    this.ReRender();
  }


  @Event("mouseleave")
  ParallaxOut(Event:MouseEvent){
    this.Images.forEach(Img => {
      Img.style.transition =  "0.15s";
      Img.style.left = ((Hx + Img.Data.hX) - (Event.x - Hx)*0 - Img.clientWidth / 2) + "px";
      Img.style.top = ((Hy + Img.Data.hY) - (Event.y - Hy)*0 - Img.clientHeight / 2) + "px"; 
      console.log(Img.Data);
      
    })
  }


  _Layers: Array<ILayer> = [];

  Background: string;

  set Layers(LA: Array<[string, number]>){
    LA.forEach(x => {
      if(x[1] == 0) this.Background = x[0];
      else this._Layers.push({
        Src: x[0],
        Layer: x[1],
        X: window.innerWidth / 2,
        Y: window.innerHeight / 2,
        hX: x[2] || 1,
        hY: x[3] || 1,
        scale: x[5] || "",
        MovementSpeed: x[4] || 0.06
      })
    })
  }

  Render() {
    return html`
      <style>
      :host{
        margin: 0 ;
        padding: 0 ;
        perspective: 100px;
        width : 100vw;
        height: 100vh;
        display: block;
        background-image: url(${this.Background});
      }  

      img{
        position: fixed;
      }
      
      </style> 
      ${this._Layers.map(x => html`
        <img src=${x.Src} .Data=${x}>
      `)}
    `;
  }

  @QueryAll("img") Images: (HTMLImageElement & {Data: ILayer})[];

  FirstRender(){
    super.FirstRender();
    this.Images.forEach(Img => {
      Img.style.transform = `translateZ(${Img.Data.Layer}px)`;
      Img.style.left = ((Hx + Img.Data.hX) - Img.clientWidth / 2) + "px";
      Img.style.top = ((Hy + Img.Data.hY) -  Img.clientHeight / 2) + "px";    
      Img.style.transform = `scale(${Img.Data.scale})`;  
    });
  }

}

@Execute
class Body extends ViewManager {
  Render() {
    return html`
      <oarkon-main .Layers=${Layers}></oarkon-main>
    `;
  }
}

@Execute
class Meta extends MetaManager {
  Title = "FullScreen IMAGE!"
  Manifest = {
    description: "FullScreen!"
  };
  Render() {
    return html`
      ${super.Render()}
      <style>
      html, body {
        margin : 0;
      }
      </style>
      `;
  }
}
