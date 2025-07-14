
export {Grid, FlexCol, FlexRow, Container, Animate, Box, Div}

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