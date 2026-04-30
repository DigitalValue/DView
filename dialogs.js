import { config } from "./config.js";
import { Button, SVGIcon } from "./elements.js";
import { Input } from "./forms.js";
import { Animate, Box, Div, FlexRow } from "./layout.js";
import { H2, Text } from "./texts.js";



export {
    alertDialog, confirmDialog,  openDialog,
    Dimmer, Modal, ModalContent, ModalFooter,  ModalHeader, 
    openPopup, promptDialog, showSnackbar
};


// el localize de aquí está bien puesto ??
function localize(localized, lang = 'es') {

    if (!localized) return '';
    if (typeof localized == 'string' || typeof localized == 'number') return localized
    if (typeof localized != 'object') return 'ERR translation:'+typeof localized; //???

    return localized[lang] || localized['es'] || localized['und']
  
}

/*
*
* DIÁLOGOS
* 
*/
function confirmDialog(options={'title':'','message':'','buttonLabels':[],'then':()=>{}, 'multiple':false, 'onSaveAnswer':()=>{}, size:'tiny'}){
    
    if(typeof options =='string') { options = {'message': options}}
    
    var elem = document.createElement("div")

    elem.style = 'inset:0px;z-index:1000000;position:fixed'
    elem.id = Math.random()*10000 + ''
    document.body.appendChild(elem);

    // TODO!! AÑADIR TRANSICIÓN DE SALIDA !!
    return new Promise((resolve,reject)=> {
        m.mount(elem, {
        onbeforeremove:()=>{
            return new Promise(function(resolve) {
                //console.log(vnode.attrs.transition)
                //console.log(vnode.dom.classList);
                vnode.dom.classList.add('fade', 'out')
                vnode.dom.children[0].classList.add('scale', 'out')
                setTimeout(resolve, 300)
            })
        },
        view:()=>  m(Modal, {size: options.size || 'tiny', center:true},
                m(ModalHeader, m(H2, localize(options.title) || 'Confirma la acción')),
                
                m(Div,{padding:'1em'}, m(Text, m.trust(localize(options.message)))),
                
                m(ModalFooter,

                    m(Button, {
                            ...options.buttonColors?.[1] ? 
                        {
                            type:'secondary',
                            style: {
                                color: options.buttonColors?.[1]
                            }
                        }: {
                            type:'positive',
                        },
                        
                        onclick:()=>{
                            options.then ? options.then(true):null; 
                            elem.remove()
                            resolve(true);
                        }
                    }, options.buttonLabels ? options.buttonLabels[1] : localize({es:'Aceptar',va:'Acceptar'})),

                    m(Button, {
                        ...options.buttonColors?.[0] ? 
                        {
                            type:'secondary',
                            style: {
                                color: options.buttonColors?.[0]
                            }
                        }: {
                            type:'negative',
                        },
                        onclick:()=>{
                            options.then ? options.then(false):null; 
                            elem.remove()
                            resolve(false)
                        }
                    },   
                        options.buttonLabels ? options.buttonLabels[0] : localize({es:'Cancelar',va:'Cancel·lar'})
                    )
                )
            )
        })
    })
}


// PARA LAS ALERTAS DE ERROR 
function alertDialog(options={
    title:'',
    message:'',
    children: '',
    buttonLabels:[],
    type:"success",
    then:()=>{}, 
    multiple:false, 
    fluid:false,
    size:"tiny",
    dom:(el)=> el // devuelve el elemento
}){
    if(typeof options == 'string'){options = {message:options}}

    var elem = document.createElement("div")

    elem.style = 'inset:0px;z-index:100000' + (options.multiple ? ';position:absolute' : 'position:fixed')
    elem.id = Math.random()*10000 + ''
    document.body.appendChild(elem);


    if(options.dom){ options.dom(elem) } // esto se utiliza ?? Llamarlo oncreate !!
   
    let types = {
        'info': {
            icon:'info',
        },
        'warning': {
            icon:'warning', 
        },
        'error': {
            icon:'error',
            text:'Error',
            color:'#db2828'
        },
        'success': {
            text:'Éxito',
            icon:'check_circle',
            color:'#00c853'
        }
    }

    // TODO!! AÑADIR TRANSICIÓN DE SALIDA !!
    return new Promise((resolve,reject)=> {
        m.mount(elem, {
            /*onbeforeremove:()=>{
                console.log('removing')
                return new Promise(function(resolve) {
                    //console.log(vnode.attrs.transition)
                    //console.log(vnode.dom.classList);
                    vnode.dom.classList.add('fade', 'out')
                    vnode.dom.children[0].classList.add('scale', 'out')
                    setTimeout(resolve, 300)
                })
            },*/
            view:()=> m(Modal, { size: options.size || 'tiny', center:true },
                    types[options.type] || options.title ? 
                    m(ModalHeader,{gap:'1em'},
                        
                        types[options.type] ?
                        m(SVGIcon, {
                            icon: types[options.type]?.icon, 
                            color: types[options.type]?.color,
                            height: 24,
                            width: 24
                        }): null,

                        m(H2,{margin:0}, 
                            options.title ||  types[options.type]?.text 
                        ),
                        
                    ):  null,

                    m(ModalContent, 
                        m(Div,{padding:'1em'}, m(Text, m.trust(options.message)))
                    ),

                    m(ModalFooter,
                        m(Button, {
                            onclick:(e)=>{
                                options.then ? options.then():null;
                                elem.remove()
                                resolve();
                            },
                            fluid:true,
                            type:'negative'
                        },
                        m(Text,options.buttonLabels ? options.buttonLabels[0] : localize({es:'Cerrar',va:"Tancar"})))
                    )
                )
        })
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

    elem.style = 'inset:0px;z-index:100000' + (options.multiple ? ';position:absolute' : 'position:fixed') // cambia algo el position ??
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
        'clone':{
            icon:'clone', 
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
        },
        'clone':{
            icon:'clone',
        }
    }

    // TODO!! AÑADIR TRANSICIÓN DE SALIDA !!
    return new Promise((resolve,reject)=> {
        m.mount(elem, {
            /*onbeforeremove:()=>{
                console.log('removing')
                return new Promise(function(resolve) {
                    vnode.dom.classList.add('fade', 'out')
                    vnode.dom.children[0].classList.add('scale', 'out')
                    setTimeout(resolve, 300)
                })
            },*/
            view:()=> m(Modal, { size:'tiny', center:true },
                types[options.type] || options.title ?
                m(ModalHeader,
                    m(SVGIcon,{ icon: types[options.type]?.icon, color: types[options.type]?.color }),
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
                    })
                ),

                m(ModalFooter,

                    m(Button, {
                        onclick:(e)=>{
                            if(!data[name]) return;
                            options.then ? options.then(data[name]):null;
                            elem.remove()
                            resolve(data[name])
                        },
                        disabled: !data[name] || data[name] == '',
                        fluid: options.fluid,
                        type: 'positive'
                    },
                        options.buttonLabels ? options.buttonLabels[0] : localize({es:'Aceptar',va:"Aceptar"})
                    ),


                    m(Button, {
                        onclick:(e)=>{
                            options.then ? options.then():null;
                            elem.remove()
                            resolve(null)
                        },
                        fluid:options.fluid,
                        type:'negative'
                    },
                        options.buttonLabels ? options.buttonLabels[0] : localize({es:'Cerrar',va:"Tancar"})
                    )
                )
            )
        })
    })
}

// Crea un dialogo con un componente custom
function openDialog(Component, options = {}) {
    if (!Component) return 
    
    var elem = document.createElement("div")

    elem.style = `position:fixed;inset:0px;z-index:${options.multiple ? '10000000':'100000'}`
    elem.id = Math.random() * 10000 + ''

    document.body.appendChild(elem);

    m.mount(elem, {
        onremove: ()=> {
            console.log("ELIMINAR")
        },
        view: () => m(Component, {
            ...(options.attrs ? options.attrs : {}),
            onCancel: (e) => { // cambiar esto por close en algún momento !!
                m.mount(elem, null)
                elem.remove()
            },
            close: (e) => {
                m.mount(elem, null)
                elem.remove()
            },
            close: (e) => {
                m.mount(elem, null)
                elem.remove()
            }
        })
    })
}


// cuadrado que sale debajo de la pantalla, está bien para móviles !!
function showSnackbar({message, duration = 3000, fixed = false, id, background = '#1a1a1a'} = {}){

    var elem = document.createElement("div")

    elem.style = 'position:fixed;inset:0px;z-index:100000'
    elem.id = id || Math.random() * 10000 + ''
    document.body.appendChild(elem);

    m.mount(elem, {
        view: () =>  m(Animate,{
            from: { transform: 'translateY(100%)' },
            to: { transform: 'translateY(0%)' },
            duration: duration || 300,
            oncreate:(vnode)=>{
                if(!fixed){
                    setTimeout(() => {
                        vnode.dom.style.transform = 'translateY(100%)';

                        setTimeout(()=>{
                            m.mount(elem, null)
                            elem.remove()
                        }, duration || 300 )
                    }, 2000);
                }
            },
            style: {
                background: background,
                padding:'1rem',
                position:'fixed',
                bottom:0, minHeight:'60px', 
                display:'flex', alignItems:'center', justifyContent:'center',
                zIndex:10, left:0, right:0
            }
        },  m(Text, {color:'white'}, message)
        )
    })


}


// abre una ventana pop up
function openPopup(url){
    const width = 500;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    // window features for popup
    const windowFeatures = `scrollbars=no, resizable=no, copyhistory=no, width=${width}, height=${height}, top=${top}, left=${left}`;
    const popup = window.open(url, "popup", windowFeatures);
    return popup;
};



function Modal(){
    let modalStyle = {
        display:'block',
        width:'850px',
        margin:0,
        position:'absolute',
        flex: '0 0 auto',
        backgroundColor:'white',
        overflow:'hidden',
        margin:'0 auto',
        borderRadius:config.borderRadius || '1em',
        transform: config.fixedModals ? 'translateX(-50%)': 'translate(-50%,-50%)',
        left:'50%',
        top: config.fixedModals ? '10vh': '50%',
        maxWidth:'90%',
        zIndex:1001,
        display:'flex',
        flexDirection:'column',
        transition: 'all 0.3s ease-out',
        outline: 'none'
    }

    let sizes = {
        'tiny': '340px',
        'small': '600px',
        'big':'850px',
        'large':'1080px', 
        'fullscreen': '90vw'
    }
    
    let dimmerStyle = {
        backgroundColor: '#000000a8',
        transition:'animate ease-in',
        position:'fixed',
        fontFamily: config.fontFamily || 'Poppins',
        inset:'0px',
        zIndex:'1000',
    }

    return {
        oninit:(vnode)=>{
            if(vnode.attrs.size && sizes[vnode.attrs.size]){
                let size = sizes[vnode.attrs.size]
                modalStyle.width = size?.width || size

                if(size.maxWidth){
                    modalStyle.maxWidth = size.maxWidth || size
                }
            }

            if(vnode.attrs.center){
                modalStyle.top = '50%',
                modalStyle.transform = 'translate(-50%,-50%)'
            }

            if(vnode.attrs.top){
                modalStyle.top = vnode.attrs.top + 'px'
            }
            /*
            if(vnode.attrs.animate){ 
                modalStyle.transform = 'translate(-50%,-30%) scale(0.7)'
            }*/

        },
        view:(vnode)=>{
            console.log('header', vnode.attrs.header)
           
            return m("div", {
                style: dimmerStyle
            }, 
                m("div",{
                    style:{ ...modalStyle, ...vnode.attrs.style },
                    tabindex: -1,
                    oncreate:({dom})=> { 
                        /*if(vnode.attrs.animate){
                            setTimeout(()=>{
                                dom.style.transform = 'translate(-50%,-40%) scale(1)'
                            }, 100)
                        }*/
                        
                        setTimeout(()=>dom.focus(),50)
                    },
                    onkeyup:(e)=>{
                        if (e.key==="Escape" && vnode.attrs.close) vnode.attrs.close()
                    }
                },  
                    vnode.attrs.header ?
                    m(ModalHeader,{  justifyContent:'space-between', alignItems:'center'},
                        m(H2,{marginBottom:0}, vnode.attrs.header),

                        m(SVGIcon,{
                            width:26, height:26, 
                            style:"cursor:pointer", 
                            icon:'circle_close', 
                            color: "#db2828",
                            onclick: vnode.attrs.close
                        })
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
                    maxHeight:'70vh',
                    ...(vnode.attrs.style || vnode.attrs)
                },
                id: vnode.attrs.id
            }, vnode.children)
        }
    }
}


function ModalHeader(){

    return {
        view:(vnode)=>{
            return m(FlexRow,{
                borderBottom:'1px solid #eaeaea', 
                justifyContent:'center', alignItems:'center', 
                padding:'1em', paddingLeft:'1.5em', fontWeight:'bold', 
                ...vnode.attrs
            },
                vnode.children
            )
        }
    }
}


function ModalFooter(){
    return {
        view:(vnode)=>{
            return m(FlexRow,{ 
                background:'#fafafa',
                borderTop:'1px solid #22242626', 
                justifyContent:'end', 
                padding:'1em', gap:'1em',
                ...vnode.attrs
            },
                vnode.children
            )
        }
    }
}


function Dimmer(){

    let dimmerStyle = {
        position: "absolute",
        inset:0,
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center',
        zIndex:100
    }


    return {
        view: (vnode)=> {
            let {inverted} = vnode.attrs 

            return m(Div,{ background: inverted ? 'rgba(255,255,255,.85)':'rgba(0,0,0,.85)', ...dimmerStyle},
                vnode.children

            )
        }
    }
}