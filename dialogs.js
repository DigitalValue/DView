

import { Modal, ModalHeader, ModalFooter, Div } from './elements.js'




export {
    alertDialog, 
    confirmDialog,
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
