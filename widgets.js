
import { localize, Page } from "./util.js"



export { 
    Grid, FlexCol, FlexRow, Container, Animate,
    Box, Div, Segment, Tappable, Span,
    H1, H2, H3, H4, Text, SmallText, Padding,
    ContainerH, ContainerV, SplitterH,  SplitterV, RippleEffect,
    TranslationInput, BackButton, Button, Icon, Input, Modal,  
    ModalFooter, ModalHeader, FormLabel, IntegerInput, Sidebar,
    Label, Message, Dropdown, Card, ModalContent, Checkbox, Spinner,TinyText,
    ScaleInContainer, Table, TableHead, TableBody, TableCell, TableRow, Switch,
    alertDialog, confirmDialog, Responsive, BreadCrumb, CssStyle, promptDialog

}



/*
*
* COMPONENTES LAYOUT
*
*/

/**
 * Anima un componente
 * @param {String} alignItems 
 * @param {String} justifyContent 
 */
function FlexCol(){
    return {
        view:(vnode)=>{
            let {justifyContent, alignItems} = vnode.attrs


            return m("div",{
                style:{
                    display:'flex',
                    flexDirection:'column',
                    ...vnode.attrs
                }, 
            }, vnode.children)
        }
    }
}

// POR DEFECTO LAS COLUMNAS Y ROWS ESTAN EN EL CENTRO
function FlexRow(){
    return {
        view:(vnode)=>{
            return m("div",{
                style:{
                    display:'flex',
                    ...vnode.attrs
                }
            }, vnode.children)
        }
    }
}


function Grid() {
    let columns = 1
    let lastColumns = 1

    let mobileColumns    
    let tabletColumns    
    let computerColumns

    let id;

    
    return {
        oninit : (vnode)=> {
            if(typeof vnode.attrs.columns == "object") {
                columns = vnode.attrs.columns?.computer
                computerColumns = vnode.attrs.columns?.computer
                mobileColumns = vnode.attrs.columns?.mobile
                tabletColumns = vnode.attrs.columns?.tablet
            }
            else {
                columns = vnode.attrs.columns
                computerColumns = vnode.attrs.columns
                if(vnode.attrs.mobileColumns) mobileColumns = vnode.attrs.mobileColumns
            }

            id = vnode.attrs.id || `grid-${Math.random().toString(36).substring(2, 9)}`

        },
        view : (vnode)=> {
            return [
                m("style",
                    `#${id} {
                        display: grid;
                        grid-template-columns: repeat(${columns}, minmax(0, 1fr));
                        gap: 1em;
                    }  `
                    // add styles for mobile and tablet with media queries
                    + (mobileColumns ? `@media (max-width: 768px) { #${id} { grid-template-columns: repeat(${mobileColumns}, minmax(0, 1fr)); } }` : '')
                    + (tabletColumns ? `@media (min-width: 769px) and (max-width: 992px) { #${id} { grid-template-columns: repeat(${tabletColumns}, minmax(0, 1fr)); } }` : '')
                    + (computerColumns ? `@media (min-width: 993px) { #${id} { grid-template-columns: repeat(${computerColumns}, minmax(0, 1fr)); } }` : '')
                ),

                m("div",{
                    id: id,
                    style : {
                        ...vnode.attrs,
                    }
                },
                    vnode.children
                )
            ]
        }
    }
}


// UN DIV AL QUE SE LE PUEDE METER DE TODOS
function Box(){

    return {
        view:(vnode)=>{
            return m("div",{
                ...vnode.attrs,
                style:{
                    
                    ...vnode.attrs
                }
            })
        }
    }
}


// Div y Tappable son intercambiables ??
// mouseover, mouseout, clickout...

/**
 * @param {Object} animation {
 *    * @param {Object} name - En caso de querer tener una animación ya hecha
 *    *  
 *    * @param {Object} from - Estilos iniciales para la animacion de entrada
 *    * @param {Object} to - Estilos finales de la animacion de entrada
 *    * @param {Object} exit - Estilos de la animacion de salida
 *    * @param {Integer} duration - milisegundos
 * }
 ** @param {Object} style - Estilos para animar al hacer hover
 ** @param {Object} hover - Estilos para animar al hacer hover
 ** @param {Object} click - Estilos para animar al hacer click
 */
function Div(){
  
    return {
        view:(vnode)=>{
            
            return m("div",{
                onremove:(e)=> document.body.removeEventListener('click', clickOut),
                oncreate:({dom})=>{
                    if(vnode.attrs.animation){
                        let animation = vnode.attrs.animation?.to
                        console.log('animation', animation)

                        setTimeout(()=> {
                            // Animacion de entrada
                            Object.keys(animation).forEach(a => {
                                dom.style[a] = animation[a]
                            })
                        }, 10)
                    }
                },
                style: {
                    ...vnode.attrs.style ? vnode.attrs.style : vnode.attrs,

                    ...vnode.attrs.animation && typeof vnode.attrs.animation == 'object' 
                    ? {
                        transition: vnode.attrs.animation.duration || `500ms`,
                        ...vnode.attrs.animation?.from
                    } 
                    : {}
                },
                ...vnode.attrs.id && {
                    id:vnode.attrs.id
                },

            }, vnode.children)
        }
    }
}


function Tappable(){

    let elem ;
    let clickout;


    function checkclickout(e){
        if (!elem.contains(e.target) ) {
            clickout()
        }
    }

    return {
        view:(vnode)=>{
            return m("div",{
                oncreate:({dom})=> { 
                    elem = dom;
                    
                    if(vnode.attrs.clickout){
                        clickout = vnode.attrs.clickout
                        
                        document.body.removeEventListener('click', checkclickout)
                        document.body.addEventListener("click", checkclickout)
                    }
                },
                onremove:(e)=> document.body.removeEventListener('click', checkclickout),
                onmouseenter:(e)=> {
                    if(vnode.attrs.hover) {
                        Object.keys(vnode.attrs.hover).forEach(h => elem.style[h] = vnode.attrs.hover[h])
                    }
                },
                onmouseleave: (e)=> {
                    if(vnode.attrs.hover) {
                        Object.keys(vnode.attrs.hover).forEach(h => elem.style[h] = vnode.attrs.style && vnode.attrs.style[h] || '')
                    }
                },
                onmousedown:(e)=> {
                    if(vnode.attrs.onmousedown) {
                        Object.keys(vnode.attrs.onmousedown).forEach(h => elem.style[h] = vnode.attrs.onmousedown[h])
                    }
                },
                
                onmouseup:(e)=> {
                    if(vnode.attrs.onmousedown) {
                        Object.keys(vnode.attrs.onmousedown).forEach(h => elem.style[h] = vnode.attrs.style && vnode.attrs.style[h] || '')
                    }
                },
                style:{ cursor:'pointer', ...vnode.attrs.style },
                id: vnode.attrs.id,
                onclick: vnode.attrs.onclick
            }, vnode.children)
        }
    }
}


function RippleEffect() {
    let rippleEffect = false
    let x,y
    let type = 'dark'
  
    let background = {
        dark:'rgb(0,0,0,0.2)',
        light: 'rgba(255,255,255,0.3)'
    }

    let time1, time2;

    function RippleSpan() {
  
      return {
        oncreate : (vnode)=> {
          setTimeout(()=> {
            vnode.dom.style.transform = "scale(100)"
            vnode.dom.style.opacity = "0"
          },1)
        },
        view : ({attrs})=> {
          return m("span.ripple",{
            style : {
              borderRadius : "50%",
              tranform : "scale(0)",
              position : "absolute",
              transition : "1s",
              backgroundColor : background[type],
              width : "10px",
              height : "10px",
              top : attrs.y,
              left : attrs.x
            }
          })
        }
      }
    }

    return {
      view : (vnode)=> {
        type = vnode.attrs.type || 'dark'

        return m("div",{
          id : vnode.attrs.id || null,
          style : {
            position : "relative",
            overflow : "hidden",
            ...vnode.attrs.style
          },
          onmousedown : (e)=> {
            //Datos para que el ripple aparezca donde se hace click
  
            const item = e.currentTarget.getBoundingClientRect()
            x = `${e.clientX - item.left}px`;
            y = `${e.clientY - item.top}px`;
  
            rippleEffect = true  
            time1 = new Date().getTime()

            setTimeout(()=> {
                rippleEffect = false
                m.redraw()
            }, 1000)
          },
          //onmouseout:(e)=> rippleEffect = false,
          onmouseup:(e)=>{
            time2 = new Date().getTime()
            
            if(vnode.attrs.onclick){
                setTimeout(()=>{
                    vnode.attrs.onclick();
                    m.redraw()
                }, time2-time1 > 500 ? 0 : 500-(time2-time1))
            }
          }
        },
          vnode.children,
          //Efecto ripple
          rippleEffect
          ?  [ m(RippleSpan,{x,y, key : rippleEffect}) ]
          : null
        )
      }
    }
}

function OutsideDiv(){
    

    return {
        view:(vnode)=>{

        }
    }
}

// BASIC DIV WITH PADDING
function Padding(){
    return {
        view:(vnode)=>{
            return m("div",{
                style: {
                    padding: '1em',
                    ...vnode.attrs
                }
            }, vnode.children)
        }
    }
}


/**
 * Anima un componente
 * @param {Object} from - Estilos iniciales para la animacion de entrada
 * @param {Object} to - Estilos finales de la animacion de entrada
 * @param {Object} exit - Estilos de la animacion de salida
 * @param {Object} style - Estilos base del componente 
 * @param {Object} hover - Estilos para animar al hacer hover
 * @param {Object} click - Estilos para animar al hacer click
 * @param {Integer} duration - milisegundos
 */
function Animate() {
    let duration;
    let styleTimeout;

    return {
        oncreate: ({attrs, dom})=> {
            let { animate={}, to={}, style={} } = attrs
            
            if(Object.keys(animate).length == 0){
                animate = to
            }

            setTimeout(()=> {
                // Animacion de entrada
                Object.keys(animate).forEach(a => {
                    dom.style[a] = animate[a] 
                })
            }, 10)

            // estilos default
            styleTimeout=setTimeout(()=> {
                Object.keys(style).forEach(a => {
                    dom.style[a] = style[a] 
                })
            }, duration)
        },
        onbeforeremove: ({attrs, dom})=> {
            let { exit={} } = attrs
            
            clearTimeout(styleTimeout)
            
            // Animacion de salida
            Object.keys(exit).forEach(a => {
                dom.style[a] = exit[a]
            })
            
            return new Promise(function(resolve) {
                setTimeout(resolve, attrs.duration || 500)
            })
        },
        view: ({attrs, children})=>{
            duration = attrs.duration || 500

            return m("div", {

                // Animacion Hover, hace falta aquí ???
                ...(attrs.hover && {
                    onmouseenter: (e)=> {
                        Object.keys(attrs.hover).forEach(a => {
                            e.target.style[a] = attrs.hover[a]
                        })

                        if(attrs.onmouseenter && typeof attrs.onmouseenter == "function") attrs.onmouseenter()
                    },
                    onmouseleave: (e)=> {
                        Object.keys(attrs.hover).forEach(a => {
                            e.target.style[a] = attrs?.style?.[a] || ""
                        })

                        if(attrs.onmouseleave && typeof attrs.onmouseleave == "function") attrs.onmouseleave()
                    }
                }),

                // Animacion click
                ...(attrs.click && {
                    onmousedown: (e)=> {
                        Object.keys(attrs.click).forEach(a => {
                            e.target.style[a] = attrs.click[a]
                        })
                    },
                    onmouseup: (e)=> {
                        Object.keys(attrs.click).forEach(a => {
                            e.target.style[a] = attrs?.style?.[a] || ""
                        })
                    }
                }),

                onclick: ()=> {
                    if(attrs.onclick && typeof attrs.onclick == "function") attrs.onclick()
                },

                style: {
                    ...attrs?.style,
                    ...attrs?.from,
                    transition: `${duration}ms`
                },
                class: attrs?.class || attrs?.className || ''
            }, children)
        }
    }
}



// 
function Center(){
    return {
        view:(vnode)=>{
            return [
                m("div",{
                    style: {
                        display:'flex',
                        alignItems:'center',
                        justifyContent:'center',
                    }
                },  vnode.children)
            ]
        }
    }
}

function CssStyle(){

    return {
        view:(vnode)=>{
            return m("style", `
               #${vnode.attrs.id} {
                ${vnode.attrs.style.computer || ''}
              };

              @media (min-width: 1100px) {
                #${vnode.attrs.id} {
                  ${vnode.attrs.style.largeComputer}
                }
              }
                
              @media (max-width: 1000px) {
                #${vnode.attrs.id} {
                  ${vnode.attrs.style.tablet}
                }
              }
              @media (max-width: 600px) {
                #${vnode.attrs.id} {
                  ${vnode.attrs.style.mobile}
                }
              }
              `
            )
        }
    }

}


/*
*
* COMPONENTES HTML
*
*/


/*
* type: primary, secondary, danger
*/
function Button(){

    let types = {
        primary: {
            color: 'white',
            border: '1px solid white',
            background: '#1b1c1d'
        },
        secondary: {
            color: '#4b4b4b',
            border: '1px solid #4b4b4b',
            background: 'white'
        },
        positive: {
            color: 'white',
            border: '1px solid #00c853',
            background: '#00c853'
        },
        negative: {
            color: '#db2828',
            border: '1px solid #db2828',
            background: 'transparent'
        },
        default: {
            color: '#4b4b4b',
            border: '1px solid #4b4b4b',
            background: 'transparent'
        },
        blue: {
            color: 'white',
            border: '1px solid #2185d0',
            background: '#2185d0'
        },
        danger: {
            color: 'red',
            border: '1px solid red',
            background: 'white'
        },
        glass: {
            color: '#1a1a1a',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            background: 'rgba(255, 255, 255, 0.25)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
        }
    }

    let sizes= {
        small: {
            paddingLeft:'0.3em',
            paddingRight:'0.3em',
            fontSize:'0.875em',
            minHeight:'30px'
        },
        default: {
            paddingLeft:`1.5em`,
            paddingRight:'1.5em',
            fontSize:'1.1em',
            minHeight:'40px'
        }
    }
    
    let brightness = 100;

    return {
        view:(vnode)=>{
            let { type='primary', onclick, disabled, fluid, icon, size } = vnode.attrs
            
            return m("div",{
                style:{
                    cursor:'pointer',
                    display:'flex',
                    alignItems:'center',
                    justifyContent:'center',
                    fontFamily:'Poppins',
                    minHeight:'40px',
                    width: fluid ? '100%': 'auto',
                    userSelect:'none',
                    filter:`brightness(${brightness}%)`,
                    borderRadius:'1em',
                    opacity: disabled ? '0.5':'1',
                    ...(fluid ? {width:'100%'} : {}),
                    ...types[type] || types.primary,
                    ...sizes[vnode.attrs.size || 'default'],
                    ...vnode.attrs.style
                },
                onclick:!disabled && onclick,
                onmouseover:(e)=>  (brightness=80),
                onmouseout:(e)=> (brightness=100),
                onmousedown:(e)=> !disabled &&(brightness=60),
                onmouseup:(e)=> (brightness=100),
            }, 
                icon ? m(Icon,{icon:icon, size: size || 'small', color: types[type].color || "black" }) : null,
                vnode.children
            )
        }
    }
}


/**
 * @attrs 
 * ICONOS DE GOOGLE
 * icon :(string)=> el nombre  del icono, ex: search
 *  
 * color:(string)=> color para el icono. black[default]
 * 
 * size:(string)=> small | medium[default] | large || huge
 * 
 * opacity:(double) => 1 [default]. Va de 0 a 1
 *   
 * El nombre del icono se saca de 
 * https://fonts.google.com/icons
 *
 **/
function Icon(){    
    let sizes = {
        'mini':'font-size:14px',
        'tiny':'font-size:16px',
        'small':'font-size:18px;',
        'medium':'',
        'large':'font-size:26px',
        'huge':'font-size:32px',
        'massive':'font-size:50px'
    }

    return {
        view:(vnode)=>{
            let {onclick} = vnode.attrs

            return m("span",{
                class:'material-icons', 
                onclick:vnode.attrs.onclick,
                style:`${sizes[vnode.attrs.size || 'medium']}; user-select: none;color:${vnode.attrs.color || 'black'};opacity:${vnode.attrs.opacity || 1};${onclick ? 'cursor:pointer':''}`,
                
            }, vnode.attrs.icon)
        }
    }
}


function Modal(){
    let modalStyle = {
        display:'block',
        width:'850px',
        margin:0,
        position:'absolute',
        backgroundColor:'white',
        margin:'0 auto',
        borderRadius:'1em',
        left:'50%',
        top:'50%',
        transform:'translate(-50%,-50%)',
        zIndex:1001,
        display:'flex',
        flexDirection:'column',

    }

    let sizes = {
        'small':'500px',
        'big':'850px',
        'tiny': '300px'
    }
    
    let dimmerStyle = {
        backgroundColor: '#000000a8',
        transition:'animate ease-in',
        position:'fixed',
        fontFamily:'Poppins',
        inset:'0px',
        zIndex:'1000',
    }

    return {
        view:(vnode)=>{
            if(vnode.attrs.size){
                modalStyle.width = sizes[vnode.attrs.size]
                modalStyle.maxWidth = '90vw'
            }

            return m("div", {
                style: dimmerStyle
            }, m("div",{
                    style:modalStyle,
                    oncreate:({dom})=> dom.focus(),
                    onkeyup:(e)=>{
                        if (e.key==="Escape" && vnode.attrs.close) vnode.attrs.close()
                    }
                },  
                    vnode.attrs.header ?
                    m(FlexRow,{ justifyContent:'space-between',borderBottom: '2px solid lightgrey', padding:'1em', alignItems:'center'},
                        m(H2,{marginBottom:0}, vnode.attrs.header),

                        m(Icon,{size:'large', style:"cursor:pointer", icon:'cancel', onclick: vnode.attrs.close})
                    ) : null,

                    vnode.children
                )
            )
        }
    }
}


function ModalContent(){

    return {
        view:(vnode)=>{
            return m("div",{
                style:{
                    padding:'1em',
                    overflowY:'auto',
                    maxHeight:'50vh'
                }
            }, vnode.children)
        }
    }
}


function ModalHeader(){

    return {
        view:(vnode)=>{
            return m(FlexRow,{borderBottom:'2px solid lightgrey', justifyContent:'center', alignItems:'center', padding:'1em', fontWeight:'bold'},
                
                vnode.children
            
            )
        }
    }
}


function Span(){
    return {
        view:(vnode)=>{
            return m("span",{
                style: {
                    ...vnode.attrs
                }
            }, vnode.children)
        }
    }
}


function Segment(){
    let types = {
        primary: {
            backgroundColor: 'white',
            border: '1px solid #e0e0e0',
            color: '#1b1c1d'
        },
        secondary: {
            backgroundColor: '#f0f0f0',
            border: '1px solid #e5e7eb',
            color: '#4b5563'
        },
        tertiary: {
            backgroundColor: '#f5f5f5',
            border: '1px solid #d1d5db',
            color: '#6b7280'
        },
        inverted: {
            backgroundColor: '#374151',
            border: '1px solid #374151',
            color: 'white'
        }
    }

    let attach = {
        'topAttached': {borderBottomLeftRadius:'0px',borderBottomRightRadius:'0px', borderBottom:'0px'},
        'bottomAttached': {borderTopLeftRadius:'0px', borderTopRightRadius:'0px'},
        'leftAttached': {borderBottomRightRadius:'0px',borderTopRightRadius:'0px', borderRight:'0px'},
        'rightAttached': {borderTopLeftRadius:'0px', borderBottomLeftRadius:'0px'},
        'attached':{borderRadius:'0px'},
    }

    return {
        view:(vnode)=>{
            let {type='default'} = vnode.attrs

            return m(Div,{
                    padding:'1rem',
                    borderRadius: '1em',
                    transition: 'all .2s ease',
                    ...types[type] || types.primary,
                    ...(vnode.attrs.basic && {border: 'none'}),
                    ...(vnode.attrs.attach && attach[vnode.attrs.attach]),
                    ...(vnode.attrs.raised && { boxShadow: '0 2px 4px rgba(34, 36, 38, .12), 0 2px 10px rgba(34, 36, 38, .15)'}),
                    ...vnode.attrs.style
                },
            vnode.children)
        }
    }
}


function Container(){
    
    
    return {
        view:(vnode)=>{
            return [
                m("style",
                    `.container {
                        @media (width < 576px ) {
                            width: 95% !important;
                        }

                        @media (width >= 576px ) {
                            width: 90% !important;
                        }
                        
                        /*
                        @media (width>=768px) {
                            width: 720px !important;
                        }

                        @media (width>=992px) {
                            width: 960px !important;
                        }*/

                        @media (width>=1200px ) {
                            width: 80% !important;
                        }
                    }
                    .container {
                        margin:0 auto !important;
                    }
                `),

                m("div",{
                    class: "container",
                 }, m(Div,{
                        //width: getWidth(),
                        paddingTop:'1em',
                        paddingBottom:'1em',
                        margin:'0 auto',
                        ...vnode.attrs
                    }, vnode.children)    
                )
            ]
        }

    }

}


/*
*
* TEXTS
*/
//loadCss('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap')

/*
*
* TEXTOS
*
*/
function H1(){
    return {
        view:(vnode)=>{
            return m("h1",{
                style: {
                    fontSize:'2.25rem',
                    lineHeight:'2.25',
                    fontFamily:'Poppins, Lato,  HelveticaNeue-Light, Helvetica Neue Light, Helvetica Neue,Lato',
                    //fontWeight:'lighter', 
                    marginTop: 0,
                    marginBottom:0,
                    ...vnode.attrs
                },
                class: vnode.attrs.class
            }, vnode.children)
        }
    }
}

function H2(){
    return {
        view:(vnode)=>{
            return m("h2",{
                style: {
                    fontSize: '1.5rem',
                    lineHeight:'1.5',
                    marginBottom:0,
                    fontFamily:'Poppins, Lato,  HelveticaNeue-Light, Helvetica Neue Light, Helvetica Neue,Lato',
                    marginTop:0,

                    ...vnode.attrs
                }
            }, vnode.children)
        }
    }
}

function H3(){
    return {
        view:(vnode)=>{
            return m("h3",{
                style: {
                    marginTop:0,
                    marginBottom:0,
                    fontFamily:'Poppins, Lato,  HelveticaNeue-Light, Helvetica Neue Light, Helvetica Neue,Lato',
                    ...vnode.attrs
                }
            }, vnode.children)
        }
    }
}

function H4(){
    return {
        view:(vnode)=>{
            return m("h4",{
                style:{
                    ...vnode.attrs
                }
            }, vnode.children)
        }
    }
}

function Text(){
    return{ 
        view:(vnode)=>{
            return m("p",{
                style:{
                    fontSize: '1.1rem',
                    lineHeight: '1.4',
                    margin: 0,
                    ...vnode.attrs
                }
            }, vnode.children)
        }
    }
}


function SmallText(){
    return{ 
        view:(vnode)=>{
            return m("p",{
                style: {
                    fontSize: "0.875rem",
                    lineHeight: "1.25rem",
                    margin: 0,
                    ...vnode.attrs
                }
            }, vnode.children)
        }
    }
}


function TinyText(){
    return{ 
        view:(vnode)=>{
            return m("p",{
                style:{
                    fontSize: '0.75rem',
                    //fontSize: '0.8em', utilizar em o px ??
                    ...vnode.attrs
                }
            }, vnode.children)
        }
    }
}


function ContainerH() {
    let totalwidth
    let lastwidth
    let width=[]
    let height

    /// !!!! Esto solo la primera vez. Una vez tienen tamaño, no mover, salvo el último.
    function recalculate(children) {
        let last=0
        let previouslast=0
        let assigned=0

        // !!! No ajusta bien el espacio cuando con los primeros segmentos ya se ocupa el 100%

        for(let i=0;i<children.length;i++) {

            // if (children[i]===null) width[i]=0 // Nunca se debe dar este caso
            if (!width[i]) width[i] = 300 // valor inicial

            if (width[i]>0) {
                last=i // El último contenedor ocupado
                assigned += width[i]
            }
        }

        // Eliminamos los espacios que hayan quedado de children que ya no están
        for(let i=children.length; i<width.length;i++) {
            assigned -=width[i]
            width[i]=0 // NO tiene contenido // !!! Mejor recortar el array
        }

        /// !!! hay que averigar si el segmento es nuevo, porque entonces tiene que robar espacio

        // El último ajusta el espacio restante
        if (totalwidth>assigned) {
            console.log("last",last)
            width[last]+=totalwidth-assigned
        }
        else if (totalwidth<assigned ) {

            // console.log("NEGATIVO",totalwidth,totalwidth-assigned,last,width)
            let remaining=assigned-totalwidth
            let j=last-1  // Supondremos que entran por la derecha
            while(remaining>0 && j>=0) {
                if (typeof width[j] !== "undefined") {
                    let cut=remaining>width[j] ? width[j] : remaining
                    width[j] -= cut
                    remaining -= cut
                }
                j--
            }
        }
    }

    return {
        oncreate:({children,dom})=>{
            totalwidth=dom.offsetWidth
            m.redraw() // Ahora que tenemos el tamaño, redibujar
            // recalculate(children) //primer ajuste
            // window.screen.height;
        },
        // onbeforeupdate:(vnode,old)=>{
        //     console.log("ContainerH.onupdate",vnode.children,old)
        // },
        onupdate:(vnode,old)=>{
            totalwidth=vnode.dom.offsetWidth
            // recalculate(vnode.children)

            /// !!! Debería recalcular también cuando cambia algún componente
            // if (totalwidth!==lastwidth) {
            //     // recalculate(vnode.children)
            //     lastwidth=totalwidth
            // }
        },
        oninit:({attrs})=>{
            console.log("oninit")
            height = attrs.height || "100vh"
        },
        view:({children})=>{

            // console.log("ContainerH.onview",children)
            /// Vamos a recalcular cada vez. A ver que pasa

            let notvoid=children.filter(c=>c!==null)
            recalculate(notvoid)

            return m("div",{
                style:`display:inline-flex;overflow:none;width:100%;height:${height};padding:0;`},
                totalwidth
                ? notvoid.map((c,i)=>[
                    m("div",{style:{
                        width:`${width[i]}px`,
                        overflow:"hidden",
                        height:"100%"
                    }},c), // El scroll ha de estar en el hijo

                    i<notvoid.length-1// El último no tiene
                    ? m(SplitterV,{
                        onchange:(e)=>{
                            let max = width[i+1] < e.movementX
                                    ? width[i+1]
                                    : e.movementX < 0 && width[i] < -e.movementX
                                    ? -width[i]
                                    : e.movementX
                            console.log(i,e.movementX,width[i],width[i+1],max)
                            width[i] +=  max
                            width[i+1] -=  max

                            /// !!!! Ajuste. Quitar cuando tengamos una forma mejor de hacerlo. Para que no queden nunca vacios
                            if (width[i+1] === 0) {
                                width[i+1]+=1
                                width[i]-=1
                            }
                            else if (width[i] === 0) {
                                width[i]+=1
                                width[i+1]-=1
                            }
                            /// !!! FIN DEL AJUSTE
                        }
                    })
                    : null
                ])
                : null
            )
        }
    }
}


function ContainerV() {
    let totalheight
    let lastheight
    let height=[]

    function recalculate(children) {
        let last=0
        let assigned=0
        for(let i=0;i<children.length;i++) {
            // valor inicial 200px
            if (typeof height[i] === "undefined") {
                height[i] = children[i]===null ? undefined : 200
            }

            if (height[i]>0) {
                last=i // El último contenedor ocupado
                assigned += height[i]
            }
        }
        // El último ajusta el espacio restante
        if (totalheight>assigned) height[last]+=totalheight-assigned
        else if (totalheight<assigned ) {

            console.log("NEGATIVO",totalheight,totalheight-assigned,last,height)
            let remaining=assigned-totalheight
            let j=last
            while(remaining>0 && j>=0) {
                if (typeof height[j] !== "undefined") {
                    let cut=remaining>height[j] ? height[j] : remaining
                    height[j]-=cut /// Y si no cabe???!!!
                    remaining -= cut
                }
                j--
            }
            console.log(height)
        }
    }

    return {
        oncreate:({children,dom})=>{
            totalheight=dom.offsetHeight
            recalculate(children)
        },
        onupdate:({children,dom})=>{
            totalheight=dom.offsetHeight
            recalculate(children)
            // /// !!! Debería recalcular también cuando cambia algún componente
            // if (totalheight!==lastheight) recalculate(children)
            //     lastheight=totalheight
        },
        view:({children})=>{

            recalculate(children)

            return m("div",{
                ///!!!! 100vw???
                style:"display:flex;flex-direction:column;overflow:none;width:100%;height:100%;padding:0;"},
                children.map((c,i)=>[
                    c!==null
                    ? [
                        m("div",{style:{
                            height:`${height[i]}px`,
                            "overflow":"hidden",
                            "width":"100%"
                        }},c),
                        i<children.length-1
                        ? m(SplitterH,{
                            onchange:(e)=>{
                                let max = e.movementY>0 && height[i+1] < e.movementY
                                        ? height[i+1]
                                        : e.movementY<0 && height[i] < -e.movementY
                                        ? -height[i]
                                        : e.movementY
                                /// !!! Comprobar también condición e.movementY<0
                                // console.log("onchange",height[i],height[i+1],e.movementY,max)
                                height[i] +=  max
                                height[i+1] -=  max
                            }
                        })
                        : null
                    ]
                    :null
                ]))
            }
    }
}


function SplitterH() {
    let selected=false // Esto se puede cambiar por reglas CSS de tailwind onhover
    let onchange
    let active=false

    function drag(e) {
        e.stopPropagation()
        onchange(e)
        m.redraw()
    }

    function stop(e) {
        active=false
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('mouseup', stop);
        m.redraw()
    }

    return {
        oninit: ({attrs}) => {
            //const { position = "left" } = attrs
            if (attrs.onchange) onchange = attrs.onchange
        },
        view: ({attrs})=>{
            return m(".ui",{
                className: selected ? "inverted" : "",
                style:`cursor:ns-resize;height:5px;background:${active||selected?'#00a7e1':'#ddd'}`,
                onmouseenter: () => selected = true,
                onmouseleave: () => selected = false,
                onmousedown: ()=>{
                    active=true
                    document.addEventListener('mousemove', drag);
                    document.addEventListener('mouseup', stop);
                }
            })
        }
    }
}

//Se puede colocar donde quieras con el atributo position: "top", "bottom", "left", "right".
//Por defecto se coloca a la izquierda.
//Devuelve el evento, así que el tamaño del elemento a modificar se realiza en el callback "onchange"
//ya sea el width (left, right) como el height (top, botttom)
function SplitterV() {
    let selected
    let onchange
    let css = {}
    let barSize = "6px"
    let active=false

    function getCssMode(position) {
        switch (position) {
            case "top": return {
                cursor: "n-resize",
                // width: "100%",
                height: barSize,
                top: "0px"
            };
            case "bottom": return {
                cursor: "n-resize",
                // width: "100%",
                height: barSize,
                bottom: "0px"
            };
            case "left": return {
                cursor: "ew-resize",
                width: barSize,
                // height: "100%",
                // top: "0px",
                // left: `-${barSize}`
            };
            case "right": return {
                cursor: "ew-resize",
                width: barSize,
                // height: "100%",
                // top: "0px",
                // right: `0px`
                //right: `-${barSize}`
            };
        }
    }

    // Si el ratón se mueve sobre un iframe se dejan de recibir eventos.
    // Para corregirlo hay que poner al iframe el style pointer-events:none
    function drag(e) {
        e.stopPropagation()
        e.preventDefault()
        onchange(e)
        m.redraw()
    }

    function stop() {
        //console.log("STOP.STOP.STOP.STOP.STOP.STOP.")
        document.body.style["-webkit-user-select"] = "initial"
        document.body.style["-moz-user-select"] = "initial"
        document.body.style["-ms-user-select"] = "initial"
        document.body.style["user-select"] = "initial"
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('mouseup', stop);
        active=false
        selected=false
        m.redraw()
    }

    return {
        oninit: ({attrs}) => {
            //const { position = "left" } = attrs
            if (attrs.onchange) onchange = attrs.onchange
            if (attrs.barSize) barSize = attrs.barSize
        },
        view: ({attrs}) => {
            const { background = "#ddd", mode = "left" } = attrs
            css = getCssMode(mode)
            return [
                m(".splitter-bar", {
                    onmouseenter: () => selected = true,
                    onmouseleave: () => selected = false,
                    style: {
                        ...css,
                        position: "sticky",  /// PAnel necesita sticky
                         //position: "absolute",
                        "background-color": active ? "#11a7e1" : selected ? "#83d5f2" :  background,
                        "transition" : "0.4s",
                        "border-radius": "2px",
                        // transition: "background-color .7s ease-out .3s",
                        'flex-shrink': 0
                    },
                    onmousedown: (e) => {
                        e.stopPropagation()
                        active=true
                        //console.log("mousedown")
                        document.body.style["-webkit-user-select"] = "none"
                        document.body.style["-moz-user-select"] = "none"
                        document.body.style["-ms-user-select"] = "none"
                        document.body.style["user-select"] = "none"
                        document.addEventListener('mousemove', drag)
                        document.addEventListener('mouseup', stop)
                    }
                })
            ]
        }
    }
}


function BackButton(){

    return {
        view:(vnode)=>{
            let {route} = vnode.attrs

            return m(Button,{type:'secondary',onclick: () => m.route.set(route)},
                
                    m(Icon,{
                        icon:'arrow_back',
                        color:'black'
                    }),

                    m("div",{style:"width:10px"}),

                    //localize({es:"Volver",va:"Tornar"})
                
            )
        }
    }
}


function ModalFooter(){

    return {
        view:(vnode)=>{
            return m(FlexRow,{borderTop:'2px solid lightgrey', justifyContent:'end', padding:'1em'},

                vnode.children
            
            )
        }
    }
}


function FormLabel(){

    let labelStyle = `font-weight:normal;display: block;
    color: black; font-size: 1em;font-family: Poppins;
    margin-bottom: 0.5em;
    white-space: normal;`

    return {
        view:(vnode)=>{
            let {label, required, info} = vnode.attrs
            
            return [
                
                m(FlexRow,
                    m("label",{style:labelStyle}, localize(vnode.children) ),
                    required ? m("span", {style:"color:red; font-weight:bold;margin-left:0.5em;"}, '*'): null,

                    info 
                    ? m(InfoTooltip,{text:info})
                    : null
                )
                
            ]
        }
    }
}


function Input(){
    let inputStyle = `line-height: 1.21428571em;
        padding: .67857143em 1em;
        font-size: 1em;
        background: #fff;
        border: 1px solid rgba(34, 36, 38, .15);
        color: rgba(0, 0, 0, .87);
        border-radius: .28571429rem;
        -webkit-box-shadow: 0 0 0 0 transparent inset;
        box-shadow: 0 0 0 0 transparent inset;
    `
    

    return {
        view: (vnode)=>{
            let { data, name, oninput, type, label, required, rows, readonly, pattern, title, onchange, placeholder, value, info} = vnode.attrs

            console.log('style', vnode.attrs.style)

            return [
                m(FlexCol,{width:'100%'},

                    label ? 
                    [
                        m(FormLabel,{required: required, info:info}, label),
                        m(Box,{height:'0.2em'})
                    ] : null,

                    m(type =='textarea'? "textarea": "input", {
                        readonly: readonly || false,
                        rows:rows,
                        style: inputStyle + (vnode.attrs.style ? vnode.attrs.style : ''),
                        oninput:(e)=>{
                            oninput ? oninput(e): ''

                            data && name ? data[name] = e.target.value : ''
                        },
                        ...( value ? {value:value}:{} ),
                        ...( data && data[name] ? {value:data[name]}:{} ),
                        ...type && type != 'textarea' ? {type:type}: {},
                        ...vnode.attrs.min && vnode.attrs.max ? {min:vnode.attrs.min, max:vnode.attrs.max}: {},
                        ...vnode.attrs.minlength && vnode.attrs.maxlength ? {minlength:vnode.attrs.minlength, maxlength:vnode.attrs.maxlength}: {},
                        ...pattern ? {pattern: pattern} : {},
                        ...(vnode.attrs.id ? { id: vnode.attrs.id }: {}),
                        ...title ? {title: title} : {},
                        ...placeholder ? {placeholder: placeholder} : {},
                        ...onchange ? {
                            onchange:(e)=>{
                                onchange(e)
                              
                            }
                        } : '',
                        //...vnode.attrs
                        
                    })
                )

            ]
        }
    }
}

function TranslationInput(){

    let languages=['es','va']
    let selectedlang=0

    return {
        oninit:(vnode)=> {
            if(Page.settings && Page.settings.languages){
                languages = Page.settings.languages.map((e)=> e.id || e)
            }

            if(vnode.attrs.initialLang){
                selectedlang = languages.findIndex((e)=> e == vnode.attrs.initialLang) || 0
            }
        },
        view:(vnode)=>{
            let {data, name, label, required, type, rows, info} = vnode.attrs

            if(!data) data = {}
            if(!name) name = 'translation'
            if( !data[name]){
                data[name] = {}
            }else if(typeof data[name] == 'string'){
                data[name] = {'es':data[name]}
            }

            /*
            if(!data[name][languages[selectedlang]]){
                
            }*/

            return m(FlexCol,{width:'100%'},
                label ? m(FormLabel,{ required:required, info:info }, label) : null,

                m(FlexRow,
                    m(Input,{
                        style:"flex-grow:2;border-radius:0em;",
                        rows: rows,
                        required:required,
                        data: data[name],
                        name: languages[selectedlang],
                        type: type,
                    }),
                    
                    m(Button,{
                        type:'default',
                        style:{borderRadius:'0em',border:'1px solid #22242626', flexGrow:1, background:'white'},
                        onclick:(e)=>{
                            selectedlang++
                            if(selectedlang>languages.length-1){
                                selectedlang=0
                            }

                            if(vnode.attrs.changedLang) vnode.attrs.changedLang(languages[selectedlang])
                        }
                    }, languages[selectedlang])
                )
            )
        }
    }
}


function Dropdown(){
    // beautiful dropdown style
    let dropdownStyle = {
        padding:'1em',
        border:'1px solid lightgrey',
        borderRadius:'0.5em',
        cursor:'pointer',
        display:'flex',
        justifyContent:'space-between',
        alignItems:'center'
    }

    return {
        oninit:({attrs})=>{
            console.log(attrs.data,attrs.name)
        },
        view:(vnode)=>{
            let {data, name, label,  onchange, info, required, value, style={}} = vnode.attrs

            return [

                m(FlexCol,
                    label ? m(FormLabel,{info:info, required:required}, label): null,

                    m("select",{
                        style: {
                            ...dropdownStyle,
                            ...style
                        },
                        onchange:(e)=>{
                            console.log('E', e.target.value)
                            data && name !=undefined ? data[name] = e.target.value: ''
                            // cambiar el e.target.value por e
                            onchange ? onchange(e.target.value): ''
                            m.redraw()
                        }
                    },
                        m("option",{disabled:true},"Selecciona una opción"),

                        vnode.children.map((o)=> m("option",{
                            value: o.value != undefined ? o.value : o, 
                            selected: data && name != undefined 
                                ? typeof o == 'object' 
                                ? data[name] == o.value 
                                : data[name] == o 
                                : value
                        }, localize(o.label || o)))
                    )
                )
            ]
        }
    }
}

// ESTO DEBE UTILIZAR DATA Y NAME Y NO UTILIZAR ESTO
function Switch() {

    return {
        view: ({ attrs })=>{
            let { isActive, activeColor = '#47c', activeBg = '#c4d5f1', onchange, data, name, label } = attrs

            
            return m(FlexRow, {gap:'0.5em', alignItems:'center', marginTop:'0.5em'}, // tal vez se pueda quitar el margin
            
                m('div',{
                    style: {
                        background: isActive || data && name && data[name] ? activeBg : '#eee',
                        width: '60px',
                        height: '30px',
                        padding: '5px',
                        borderRadius: '50px',
                        cursor: 'pointer',
                        
                    },
                    onclick: ()=> {
                        
                        if(data && name) {
                            if(data[name] == undefined) data[name] = false
                            data[name] = !data[name]
                            isActive = data[name]
                        }


                        if(onchange && typeof onchange == "function") onchange()
                    }
                },[
                    m('input',{
                        style: { display: 'none' },
                        type: 'checkbox',
                        checked: isActive || data && name && data[name] ? true : false,
                    }),
                    m('label', {
                        style: {
                            width: '20px',
                            height: '20px',
                            background: isActive || data && name && data[name] ? activeColor : '#ccc',
                            display: 'flex',
                            cursor: 'pointer',
                            borderRadius: '50px',
                            transition: 'all 0.25s ease 0s',
                            marginLeft: isActive || data && name && data[name] ? '30px' : '0px',
                        }
                    })
                ]),

                label && m(Text, localize(label))
            )
        }
    }
}


function Message(){

    let messageStyle = {
        position: "relative",
        minHeight: "1em",
        margin: "0 0",
        background: "#f8ffff",
        padding: "1em 1.5em",
        lineHeight: "1.4285em",
        color: "#276f86",
        borderRadius: "1em",
        boxShadow: "0 0 0 2px #a9d5de inset,0 0 0 0 transparent"
    }

    // set different types 

    return {
        view:(vnode)=>{
            return m("div", {
                style: messageStyle
            }, vnode.children)
        }
    }
}


/*
*
*   INPUT THAT ONLY GETS INTEGER NUMBERS
*
*/
function IntegerInput(){

    let inputStyle = `line-height: 1.21428571em;
        padding: .67857143em 1em;
        font-size: 1em;
        background: #fff;
        border: 1px solid rgba(34, 36, 38, .15);
        color: rgba(0, 0, 0, .87);
        border-radius: .28571429rem;
        -webkit-box-shadow: 0 0 0 0 transparent inset;
        box-shadow: 0 0 0 0 transparent inset;`

    let on = false;

    return {
        view: (vnode)=>{
            let { data, name, max, min=0, label, onchange, jump=1, required } = vnode.attrs
            
            return [
                m(FlexCol,
                    label ? m(FormLabel, {required:required}, label) : null,


                    m("div",{style: inputStyle}, 
                        m(FlexRow,{alignItems:'center',justifyContent:'space-between'},
                            m("div",
                                data && name && data[name] ? data[name]: 0,
                            
                                // se le puede pasar elementos dentro
                                vnode.children 
                            ),

                            m(FlexRow,
                                m(Icon,{
                                    icon:'remove',
                                    color: data[name] && data[name] > 0 && data[name]>min ? 'black' : 'lightgrey',
                                    onclick:(e)=>{
                                        if((min == undefined || data[name]>min) &&  data[name] && data[name] > 0){
                                            data[name] -= jump

                                            if(onchange) onchange(-1)
                                        }
                                        
                                        
                                    }
                                }),

                                m(Icon,{
                                    icon:'add',
                                    color: max !=undefined && (data[name] == max || max == 0) ? 'lightgrey': 'black',
                                    onclick:(e)=>{
                                        if(!data[name]) data[name] = 0

                                        console.log('MAX', max,  data[name])

                                        if(max == undefined || data[name] < max){
                                            data[name] += jump

                                            if(onchange) onchange(1)
                                        }

                                    
                                    }
                                })
                            )
                        )
                    )
                )
            ]
        }
    }
}


//TODO: LABEL
function Label(){

    let types = {
        default: {
            backgroundColor: "#1b1c1d",
            color: "white",
            border: "1px solid #e8e8e8"
        },
        primary: {
            backgroundColor: "#1b1c1d",
            color: "white",
            border: "1px solid #1b1c1d"
        },
        secondary: {
            backgroundColor: "#4b5563",
            color: "white",
            border: "1px solid #4b5563"
        },
        positive: {
            backgroundColor: "#00c853",
            color: "white",
            border: "1px solid #00c853"
        },
        negative: {
            backgroundColor: "#db2828",
            color: "white",
            border: "1px solid #db2828"
        },
        blue: {
            backgroundColor: "#2185d0",
            color: "white",
            border: "1px solid #2185d0"
        },
        warning: {
            backgroundColor: "#f39c12",
            color: "white",
            border: "1px solid #f39c12"
        },
        info: {
            backgroundColor: "#17a2b8",
            color: "white",
            border: "1px solid #17a2b8"
        },
        light: {
            backgroundColor: "#f8f9fa",
            color: "#495057",
            border: "1px solid #f8f9fa"
        },
        dark: {
            backgroundColor: "#343a40",
            color: "white",
            border: "1px solid #343a40"
        }
    }

    // follow the fontSizes of H2, Text and SmallText
    let sizes = {
        'default': {
            fontSize:'0.875em',
        },
        'large': {
            fontSize:'1.1em',
            padding: ".75em 1em"
        }
    }

    return {
        view:(vnode)=>{
            let { type='default', size = 'default'} = vnode.attrs

            return [
                m("div",{
                    style: {
                        display: "inline-block",
                        lineHeight: "1",
                        verticalAlign: "baseline",
                        margin: "0 .14285714em",
                        backgroundImage: "none",
                        padding: ".5833em .833em",
                        textTransform: "none",
                        fontWeight: "700",
                        borderRadius: "2em",
                        transition: "background .1s ease",
                        cursor: vnode.attrs.onclick ? 'pointer' : 'default',
                        ...types[type],
                        ...(vnode.attrs.basic && { 
                            backgroundColor:'white',
                            color: types[type].backgroundColor || 'black'
                        }),
                        ...(sizes[size] || sizes['default']),
                        ...vnode.attrs.style
                    },
                    //onclick: vnode.attrs.onclick
                }, 
                    vnode.attrs.icon || vnode.attrs.text ? 
                    m(FlexRow, {gap:'0.5em', alignItems:'center'},
                        vnode.attrs.icon && m(Icon,{icon:vnode.attrs.icon, size:'small'}),
                        vnode.attrs.text && m(SmallText, vnode.attrs.text),
                    ) : null,

                    vnode.children
                )
            ]
        }
    }
}


function Checkbox(){

    let checkboxStyle = {
        width:'17px', 
        height:'17px',
        cursor:'pointer',
    }

    return {
        view:(vnode)=>{
            let {data, name, onchange,label, checked} = vnode.attrs

            return [
                m(FlexRow, {alignItems:'center', gap:'0.5em'},
                    m("input",{
                        type:'checkbox',
                        checked: data && name ? data[name] : checked,
                        style: checkboxStyle,
                        onchange:(e)=>{
                            if(data && name){
                                data[name] = e.target.checked
                            }

                            onchange ? onchange(e): ''
                        }
                    }),
                    
                    label ? m(Text, label) : null
                    //m("label", localize(label))
                )
            ]
        }
    }
}


function Card(){

    let shadow = 'rgba(50, 50, 93, 0.25) 0px 2px 5px -1px'
    
    return {
        view: (vnode) => {
            let { photo, title, type, description, borderColor ='lightgrey', labels, style} = vnode.attrs

            return [
                m("div",{
                    style:{
                        height:'100%',
                        border:'2px solid rgb(224, 224, 224)',
                        cursor:'pointer', height:'100%', background: type == 'secondary' ? '#e0e0e0': 'white', //border:'1px solid lightgrey',
                        borderRadius:'1em', position:'relative', padding: !photo ? '1em':'0em',
                        ...(style || vnode.attrs)
                    },
                    onclick: vnode.attrs.onclick,
                    onmouseenter:(e)=>{
                       vnode.attrs.onclick ? shadow = 'rgba(0, 0, 0, 0.35) 0px 5px 15px': null
                    },
                    onmouseleave:(e)=>{
                        shadow = 'rgba(50, 50, 93, 0.25) 0px 2px 5px -1px'
                    },
                },
                    
                    m(FlexCol,{ height: '100%', width: '100%', justifyContent: 'center', position:'relative'},
                        labels ? [
                            m(FlexRow, {gap:'0.5em', position:'absolute', top:'0.5em', left:'0.5em', zIndex:1},
                                labels.map((label) =>
                                    m(Label, {
                                        ...label,
                                        size:'small'
                                    })
                                )
                            ),
                            !photo && m(Div, {height:'2em'})
                        ] : null,

                        photo ?
                        [
                            m("img", { 
                            "src": photo + '?w=300', 
                            "style": { 
                                "width": "100%",  "height": "auto", "max-height":'150px', 
                                "object-fit":"contain", "border-style": "none", "background":'white',
                                'border-top-left-radius':'1em', 'border-top-right-radius':'1em', 'object-fit':'cover',
                                //'border-bottom':'1px solid lightgrey',
                                ...vnode.attrs.imgStyle
                            } 
                            }),

                            m(Div, {
                                height:'1px',
                                borderTop: `2px solid ${borderColor}`,
                                width:'90%',
                                margin:'0 auto',
                            })
                        ]
                        : null,
                        
                        description || title ?
                        m(FlexCol,{flex:2, padding:'1em', justifyContent: 'center'},
                            m(Text,{fontWeight:'bold', width:'90%', marginTop:'0.5em', marginBottom:'0.5em'}, title),

                            description ? m(SmallText, {
                                display: "-webkit-box", 
                                "-webkit-box-orient": "vertical", 
                                "-webkit-line-clamp": 4,  // esto debe de ser configurable !!
                                "overflow": "hidden", 
                                "text-overflow": "ellipsis", 
                                'color':'grey'
                            }, m.trust(description)) : null,

                            m(Box,{height:'0.5em'}),
                        ) : null,


                        vnode.children
                    ),

                   // 

                )
            ]
        }
    }
}


function BreadCrumb(){

    return {
        view:(vnode)=>{
            let {style, onclick} = vnode.attrs


            return [
                m(FlexRow, {gap:'1em', alignItems:'center', ...style},
                    vnode.children.map((item,i)=>{
                        let active = i == vnode.children.length -1
                        
                        return [
                            m(Tappable,{
                                onclick:(e)=> {
                                    if(!active) onclick(i)
                                }
                            }, m(Text, {
                                fontWeight: active  ? 'bold': 'normal', 
                                ...style 
                            }, localize(item.label || item))),
                        
                            !active && m(Icon,{icon:'chevron_right'}) 
                        ]
                    })    
                )
            ]

        }
    }
}


function Spinner(){
    // can you create different sizes, only sizes
    let sizes = {
        small: {
            width: 20,
            height: 20
        },
        medium: {
            width: 40,
            height: 40
        },
        large: {
            width: 60,
            height: 60
        }
    }

    let spinStyle = {
        "box-sizing": "border-box",
        "display": "block",
        "position": "absolute",
        "margin": "8px",
        "border": "8px solid transparent",
        "border-radius": "50%",
        "animation": "lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite",
        "border-top": "8px solid currentColor"
    }


    return {
        view:(vnode)=>{
            let {color, size = 'small'}= vnode.attrs

            
           return [
                // código copiado de stackoverflow, habrá que pasarlo a nuestro modelo
                // cambia la clase por id
                m(`style`, `
                @keyframes lds-ring {
                    0% {
                        transform: rotate(0deg);
                    }
                    100% {
                        transform: rotate(360deg);
                    }
                }`),
                    
                m(Div,{
                    "display": "inline-flex",
                    justifyContent: "center",
                    "position": "relative",
                    "width": `${sizes[size].width*2}px`,
                    "height": `${sizes[size].height*2}px`,
                },
                    
                    m(Div,{
                        style: {
                            ...spinStyle,
                            color: color || '#1c4c5b',
                            width: `${sizes[size].width}px`,
                            height: `${sizes[size].height}px`,
                            "animation-delay": "-0.45s"
                        }
                    }),

                    m(Div,{
                        style: {
                            ...spinStyle,
                            color: color || '#1c4c5b',
                            width: `${sizes[size].width}px`,
                            height: `${sizes[size].height}px`,
                            "animation-delay": "-0.3s"
                        }
                    })
                )
                
           ]
        }
    }
}


//FUNCIÓN DE SIDEBAR PARA UTILIZAR EN OTROS SITIOS
function Sidebar() {
    let transitions = { in: '.transition.animating.in.slide.left', out: '.transition.animating.out.slide.left' }

    let transition

    return {
        oninit: () => {
            transition = transitions.in
        },

        view: (vnode) => {
            //también podrías sarle tu la posición. Right,left,top...
            return m(`.ui.right.sidebar${transition}`,
                {

                    tabindex:'0',
                    oncreate: ({ dom }) => {
                        dom.focus()
                    },
                    onkeyup: (e) => {
                        console.log('ONKEYUP')
                        if (e.key === 'Escape' && vnode.attrs.close) {
                            vnode.attrs.close()
                        }
                    },
                    style: vnode.attrs.style,
                    class: vnode.attrs.class
                },
                vnode.children
            )
        },

        onbeforeremove: (vnode) => {
            return new Promise(function(resolve) {
                vnode.dom.classList.add('transition','animating','out','slide','left')
                setTimeout(resolve, 300)

                // modaltransition='.scaleOut';
                // dimmertransition = '.fadeOut';
                // call after animation completes

            })
        }
    }
}




function ScaleInContainer(){

    return {
        view:(vnode)=>{
            return m("div",{
                class:"transition scale in",
                style:vnode.attrs.style,
                onbeforeremove:(e)=>{
                    return new Promise(function (resolve) {
                        vnode.dom.classList.remove('in','transition','animating','scale')
                        vnode.dom.classList.add('visible','transition','animating','scale','out')
                        //vnode.dom.classList.add('transition fade out')
                        vnode.dom.addEventListener("animationend", resolve)
                    })
                }
            },vnode.children)
        }
    }
}



function Table(){
    let tableStyle = {
        width: "100%",
        background: "#fff",
        margin: "1em 0",
        border: "1px solid rgba(34,36,38,.15)",
        boxShadow: "none",
        borderRadius: "0.28571429rem",
        textAlign: "left",
        color: "rgba(0,0,0,.87)",
        borderCollapse: "separate",
        borderSpacing: "0",
        borderRadius:'1em'
    }

    return {
        view:(vnode)=>{
            return m("table",{
                style:tableStyle,
            }, 
                // use rows and
                vnode.attrs.header ? m(TableHead,  
                    vnode.attrs.header.map((cell)=>{
                        return m(TableCell, {
                                header: true,
                                colspan: cell.colspan || 1,
                                style: cell.style || {},
                                onclick: cell.onclick || null,
                            }, cell.label || cell)
                    })
                ) : null,

                vnode.attrs.body ? m(TableBody,  vnode.attrs.body.map((row)=>
                    m(TableRow, 
                        row.map((cell)=>
                            m(TableCell, {
                                header: cell.header || false,
                                colspan: cell.colspan || 1,
                                style: cell.style || {},
                                onclick: cell.onclick || null,
                          }, cell.content || cell.text || cell.label || cell.value || cell)
                        )
                    )
                )) : null,

                //vnode.attrs.footer ? m(TableFoot, vnode.attrs.footer) : null,
            
            
                vnode.children
        
            )
        }
    }
}

function TableHead(){
    let style = {
        boxShadow: "none",
        padding:'1em',
        cursor: "auto",
        background: "#24303f",
        textAlign: "inherit",
        color: "white",
        borderTopRadius:'1em',
        verticalAlign: "middle",
        fontWeight: 700,
        textTransform: "none",
        borderBottom: "1px solid rgba(34,36,38,.1)",
        borderLeft: "none",
        // add borderRadius top
        borderTopLeftRadius: '1em',
        borderTopRightRadius: '1em',
        position: 'sticky',
        top: 0
    }
    

    return {
        view:(vnode)=>{
            return m("thead",{
                style: style
            }, vnode.children
            )
        }
    }
}

function TableBody(){

    return {
        view:(vnode)=>{
            return m("tbody",{
                style:  {
                    ...vnode.attrs
                }
            }, vnode.children)
        }
    }
}

function TableRow(){
    return {
        view:(vnode)=>{
            return m("tr",{
                style:{
                    ...vnode.attrs
                },
                onclick : vnode.attrs.onclick ? vnode.attrs.onclick : null,
                onmouseenter : vnode.attrs.onmouseenter ? vnode.attrs.onmouseenter : null,
                onmouseleave : vnode.attrs.onmouseleave ? vnode.attrs.onmouseleave : null,
            }, vnode.children)
        }
    
    }
}

function TableCell(){
    return {
        view: (vnode)=>{
            let {header= false}=vnode.attrs

            return m(header ? "th" : "td",{
                colspan: vnode.attrs.colspan,
                style: {
                    textAlign:'left',
                    padding:'1em',
                    ...vnode.attrs
                }
            }, vnode.children)
        }
    }
}

function Responsive(){
    return {
        view: (vnode)=>{
            return [

            ]
        }
    }
}


function InfoTooltip(){
    let showingInfo

    let tooltipstyle = `pointer-events: none;
        position: absolute;
        text-transform: none;
        text-align: left;
        white-space: nowrap;
        font-size: 1rem;
        border: 1px solid #d4d4d5;
        line-height: 1.4285em;
        max-width: none;
        cursor:pointer;
        background: #fff;
        padding: .833em 1em;
        font-style: bold;
        color: rgba(0,0,0,.87);
        border-radius: .28571429rem;
        -webkit-box-shadow: 0 2px 4px 0 rgba(34,36,38,.12),0 2px 10px 0 rgba(34,36,38,.15);
        box-shadow: 0 2px 4px 0 rgba(34,36,38,.12),0 2px 10px 0 rgba(34,36,38,.15);
        z-index: 1;
        left: 50%;
        -webkit-transform: translateX(-50%);
        transform: translateX(-50%);
        bottom: 100%;
        margin-bottom: .5em;
    `

    return {
        view:(vnode)=>{
            let { text, inverted } = vnode.attrs

            return [

                /** ANIMACIONES SCALEIN AND OUT */
                m("style",`
                    .fadein {
                        animation: fadein 0.3s;
                    }
                    .fadeout {
                        animation: fadeout 0.3s;
                    }
                    @keyframes fadein {
                        0% { opacity:0; }
                        100% { opacity:1; }
                    }
                    @keyframes scaleOut {
                        0% { opacity:1; }
                        100% { opacity:0; }
                    }
                `),

                // Cambiar esto por un icono de google  ??
                m("i.blue.question.circle.outline.link.icon.visible", {
                    class: showingInfo ? 'visible' : '',
                    onmouseover:(e)=> showingInfo = true,
                    onmouseout:(e)=> showingInfo = false,
                    style:"margin-left:5px; position:relative",
                },


                    m("div",{
                        class: showingInfo ? 'fadein' : showingInfo != undefined ? 'fadeout':'',
                        style: showingInfo == undefined || !showingInfo ? 'display:none' :
                               tooltipstyle + (inverted ? 'background:#000000de; color:white;' : ''),
                        onmouseover:(e)=> showingInfo = true,
                        onmouseout:(e)=> showingInfo = false,
                    },m.trust(localize(text || vnode.children)))
                )
            ]
        }
    }
}




/*
*
* DIÁLOGOS
* 
*/
function confirmDialog(options={'title':'','message':'','buttonLabels':[],'then':()=>{}, 'multiple':false, 'onSaveAnswer':()=>{}, size:'tiny'}){
    var elem = document.createElement("div")

    elem.style = 'inset:0px;z-index:1000000;position:fixed'
    elem.id = Math.random()*10000 + ''
    document.body.appendChild(elem);

    console.log(document.body.clientHeight)
    // TODO!! AÑADIR TRANSICIÓN DE SALIDA !!
    m.mount(elem, {
      onbeforeremove:()=>{
          console.log('removing')
          return new Promise(function(resolve) {
              //console.log(vnode.attrs.transition)
              //console.log(vnode.dom.classList);
              vnode.dom.classList.add('fade', 'out')
              vnode.dom.children[0].classList.add('scale', 'out')
              setTimeout(resolve, 300)
          })
      },
      view:()=>  m(Modal, {size: options.size || 'tiny'},
              m(ModalHeader, m(H2, options.title || 'Confirma la acción')),
              
              m(Div,{padding:'1em'},    m.trust(options.message)),
              
              m(ModalFooter,

                m(Button, {
                    type:'positive',
                    onclick:()=>{options.then ? options.then(true):null; elem.remove()}
                }, options.buttonLabels ? options.buttonLabels[1] : localize({es:'Aceptar',va:'Acceptar'})),

                m(Box,{width:'10px'}),

                m(Button, {
                    type:'negative',
                    onclick:()=>{options.then ? options.then(false):null; elem.remove()}}, options.buttonLabels ? options.buttonLabels[0] : localize({es:'Cancelar',va:'Cancel·lar'})
                ),

            
                
              )
          )
    })
}


// PARA LAS ALERTAS DE ERROR 
function alertDialog(options={
    title:'',
    message:'',
    buttonLabels:[],
    type:"success",
    then:()=>{}, 
    multiple:false, 
    fluid:false,
    dom:(el)=>el // devuelve el elemento
}){

     console.log('message', options.message, options)


    var elem = document.createElement("div")

    elem.style = 'inset:0px;z-index:100000' + (options.multiple ? ';position:absolute' : 'position:fixed')
    elem.id = Math.random()*10000 + ''
    document.body.appendChild(elem);

    if(typeof options == 'string'){
        options = {message:options}
    }

    if(options.dom){
        options.dom(elem)
    }


   
    let types = {
        'info':{
            icon:'info',
        },
        'warning':{
            icon:'warning', 
        },
        'error':{
            icon:'error',
            text:'Error',
            color:'#db2828'
        },
        'success':{
            text:'Éxito',
            icon:'check_circle',
            color:'#00c853'
        }
    }

    // TODO!! AÑADIR TRANSICIÓN DE SALIDA !!
    m.mount(elem, {
        onbeforeremove:()=>{
            console.log('removing')
            return new Promise(function(resolve) {
                //console.log(vnode.attrs.transition)
                //console.log(vnode.dom.classList);
                vnode.dom.classList.add('fade', 'out')
                vnode.dom.children[0].classList.add('scale', 'out')
                setTimeout(resolve, 300)
            })
        },
        view:()=> m(Modal, { size:'tiny' },
                types[options.type] || options.title ? 
                m(ModalHeader,
                    m(Icon,{icon: types[options.type]?.icon, color: types[options.type]?.color }),
                    m(Box,{width:'10px'}),
                    m(H2,{marginTop:0}, options.title ||  types[options.type]?.text )
                ):  null,

                m(ModalContent, m(Div,{padding:'1em'}, m.trust(options.message))),

                m(ModalFooter,
                    m(Button, {
                        onclick:(e)=>{
                            options.then ? options.then():null; 
                            elem.remove()
                        },
                        fluid:options.fluid,
                        type:'negative'
                    },
                    options.buttonLabels ? options.buttonLabels[0] : localize({es:'Cerrar',va:"Tancar"}))
                )
            )
    })
}


// DIÁLOGO DE CONFIRMACIÓN CON SEMANTIC !
// PARA LAS ALERTAS DE ERROR ??
function promptDialog(options={
    title:'',
    message:'',
    buttonLabels:[],
    type:"success",
    then:()=>{}, 
    multiple:false, 
    fluid:false,
    dom:(el)=>el // devuelve el elemento
}){
    var elem = document.createElement("div")

    elem.style = 'inset:0px;z-index:100000' + (options.multiple ? ';position:absolute' : 'position:fixed')
    elem.id = Math.random()*10000 + ''
    document.body.appendChild(elem);

    if(typeof options == 'string'){
        options = {message:options}
    }

    if(options.dom){
        options.dom(elem)
    }

    let data = options.data || {}
    let name = options.name || 'input'

   
    let types = {
        'info':{
            icon:'info',
        },
        'warning':{
            icon:'warning', 
        },
        'error':{
            icon:'error',
            text:'Error',
            color:'#db2828'
        },
        'success':{
            text:'Éxito',
            icon:'check_circle',
            color:'#00c853'
        }
    }

    // TODO!! AÑADIR TRANSICIÓN DE SALIDA !!
    m.mount(elem, {
        onbeforeremove:()=>{
            console.log('removing')
            return new Promise(function(resolve) {
                //console.log(vnode.attrs.transition)
                //console.log(vnode.dom.classList);
                vnode.dom.classList.add('fade', 'out')
                vnode.dom.children[0].classList.add('scale', 'out')
                setTimeout(resolve, 300)
            })
        },
        view:()=> m(Modal, { size:'tiny' },
                types[options.type] || options.title ? 
                m(ModalHeader,
                    m(Icon,{ icon: types[options.type]?.icon, color: types[options.type]?.color }),
                    m(Box,{ width:'10px' }),
                    m(H2,{ marginTop:0 }, options.title ||  types[options.type]?.text )
                ) :  null,

                m(Div,{padding:'1em'}, 
                    
                    m(Input,{
                        label: options.message,
                        type: options.type || 'text',
                        data: data,
                        name: name,
                        onchange: options.onchange || (()=>{}),
                        placeholder: options.placeholder || localize({es:'Escribe aquí...',va:'Escriu ací...'}),
                        fluid: options.fluid || false,
                    }),
                    
                ),

                m(ModalFooter,
                   
                    

                     m(Button, {
                        onclick:(e)=>{
                            if(!data[name]) return;
                            options.then ? options.then(data[name]):null; 
                            elem.remove()
                        },
                        disabled: !data[name] || data[name] == '',
                        fluid: options.fluid,
                        type: 'positive'
                    },
                        options.buttonLabels ? options.buttonLabels[0] : localize({es:'Aceptar',va:"Aceptar"})
                    ),

                    m(Box, {width:'1em'}),

                     m(Button, {
                        onclick:(e)=>{
                            options.then ? options.then():null; 
                            elem.remove()
                        },
                        fluid:options.fluid,
                        type:'negative'
                    },
                        options.buttonLabels ? options.buttonLabels[0] : localize({es:'Cerrar',va:"Tancar"})
                    ),


                )
            )
    })
}
