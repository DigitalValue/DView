import { RippleEffect } from "./elements.js"


export {
    Container,
    Grid, FlexCol, FlexRow, 
    Div, Animate, Tappable, Draggable,
    Box, CssStyle, ViewPortComponent
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
                            width: 65% !important;
                        }
                    }
                    .container {
                        margin:0 auto !important;
                    }
                `),

                m("div",{
                    class: "container",
                 }, 
                    m(Div,{
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

            return m("div",{
                style:{
                    display:'flex',
                    flexDirection:'column',
                    ...(vnode.attrs?.style),
                    ...(vnode.attrs)
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
                    ...vnode.attrs?.style || vnode.attrs 
                }
            }, vnode.children)
        }
    }
}


function Grid() {
    let columns = 1
    let lastColumns = 1

    let mobileColumns
    let largeMobileColumns
    let tabletColumns
    let computerColumns
    let gap = '1em'
    let mobileGap = null
    let largeMobileGap = null
    let tabletGap = null
    let computerGap = null
    let padding = null
    let mobilePadding = null
    let largeMobilePadding = null
    let tabletPadding = null
    let computerPadding = null

    let id;

    function getResponsiveValue(value, key) {
        if (!value) return null
        if (typeof value !== "object") return key === 'base' ? value : null
        return value[key] || null
    }

    function getGridCss(columnValue, gapValue, paddingValue) {
        return [
            columnValue ? `grid-template-columns: repeat(${columnValue}, minmax(0, 1fr));` : '',
            gapValue ? `gap: ${gapValue};` : '',
            paddingValue ? `padding: ${paddingValue};` : '',
        ].join('')
    }

    function setGridData(attrs) {
        attrs = attrs || {}

        let columnConfig = attrs.columns

        largeMobileColumns = null
        tabletColumns = null
        computerColumns = null
        mobileColumns = null

        if(typeof columnConfig == "object") {
            columns = columnConfig?.base || columnConfig?.computer || 1
            computerColumns = columnConfig?.computer
            mobileColumns = columnConfig?.mobile
            largeMobileColumns = columnConfig?.largeMobile
            tabletColumns = columnConfig?.tablet
        }
        else {
            columns = columnConfig || 1
            computerColumns = columnConfig
            if(attrs.mobileColumns) mobileColumns = attrs.mobileColumns
        }

        gap = getResponsiveValue(attrs.gap, 'base') || getResponsiveValue(attrs.gap, 'mobile') || (typeof attrs.gap !== "object" ? attrs.gap : null) || '1em'
        mobileGap = getResponsiveValue(attrs.gap, 'mobile')
        largeMobileGap = getResponsiveValue(attrs.gap, 'largeMobile')
        tabletGap = getResponsiveValue(attrs.gap, 'tablet')
        computerGap = getResponsiveValue(attrs.gap, 'computer')

        padding = getResponsiveValue(attrs.padding, 'base') || getResponsiveValue(attrs.padding, 'mobile') || (typeof attrs.padding !== "object" ? attrs.padding : null) || null
        mobilePadding = getResponsiveValue(attrs.padding, 'mobile')
        largeMobilePadding = getResponsiveValue(attrs.padding, 'largeMobile')
        tabletPadding = getResponsiveValue(attrs.padding, 'tablet')
        computerPadding = getResponsiveValue(attrs.padding, 'computer')
    }

    function getStyle(attrs) {
        let style = {
            ...attrs,
            ...(typeof attrs.style === "object" ? attrs.style : {}),
        }

        delete style.columns
        delete style.mobileColumns
        delete style.largeMobileColumns
        delete style.tabletColumns
        delete style.computerColumns
        delete style.gap
        delete style.padding
        delete style.class
        delete style.className
        delete style.id
        delete style.style

        return style
    }
    return {
        oninit : (vnode)=> {
            setGridData(vnode.attrs)
            id = vnode.attrs.id || `grid-${Math.random().toString(36).substring(2, 9)}`

        },
        view : (vnode)=> {
            setGridData(vnode.attrs)

            let hasLargeMobile = largeMobileColumns || largeMobileGap || largeMobilePadding
            let mobileMedia = hasLargeMobile ? '(max-width: 479px)' : '(max-width: 768px)'
            let tabletMedia = hasLargeMobile ? '(min-width: 768px) and (max-width: 1023px)' : '(min-width: 769px) and (max-width: 992px)'
            let computerMedia = hasLargeMobile ? '(min-width: 1024px)' : '(min-width: 993px)'

            return [
                m("style",
                    `#${id} {
                        display: grid;
                        ${getGridCss(columns, gap, padding)}
                    }`
                    + (mobileColumns || mobileGap || mobilePadding ? `@media ${mobileMedia} { #${id} { ${getGridCss(mobileColumns, mobileGap, mobilePadding)} } }` : '')
                    + (largeMobileColumns || largeMobileGap || largeMobilePadding ? `@media (min-width: 480px) and (max-width: 767px) { #${id} { ${getGridCss(largeMobileColumns, largeMobileGap, largeMobilePadding)} } }` : '')
                    + (tabletColumns || tabletGap || tabletPadding ? `@media ${tabletMedia} { #${id} { ${getGridCss(tabletColumns, tabletGap, tabletPadding)} } }` : '')
                    + (computerColumns || computerGap || computerPadding ? `@media ${computerMedia} { #${id} { ${getGridCss(computerColumns, computerGap, computerPadding)} } }` : '')
                ),

                m("div",{
                    id: id,
                    class: vnode.attrs.class || vnode.attrs.className,
                    style : {
                        width:'100%',
                        ...getStyle(vnode.attrs),
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
                style:{
                    height: vnode.attrs.height,
                    width: vnode.attrs.width
                }
            })
        }
    }
}

/**
 * Componente de utilidad que retrasa el renderizado de sus hijos hasta que
 * el componente entra en el viewport.
 */
function ViewPortComponent() {
    let on = false
    return {
        oncreate: ({ dom, attrs }) => {
            const { callback } = attrs
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    on = true
                    m.redraw()
                    if (typeof callback === "function")
                        callback()
                    observer.disconnect()
                }
            });
            observer.observe(dom);
        },
        view: ({ children, attrs }) => {
            return m("div", {
                ...attrs,
                callback: null,
                style: { ...attrs.style }
            }, on  && children)
        }
    }
}



/**
 ** @param {Object} style - Estilos base
 ** @param {String} id - Id del div
*/
function Div(){
  
    return {
        view:(vnode)=>{
            
            return m("div",{
                style: {
                    ...vnode.attrs.style 
                        ? vnode.attrs.style 
                        : vnode.attrs,  
                },
                ...vnode.attrs.id && {
                    id:vnode.attrs.id
                },
                class: vnode.attrs.class
            }, vnode.children)
        }
    }
}



/**
 * Anima un componente
 * @param {Object} style - Estilos base del componente 
 * @param {Object} hover - Estilos para animar al hacer hover
 * @param {Object} click - Estilos para animar al hacer click
 * @param {Function} onhover - Funcion que se ejecuta al hacer hover
 * @param {Function} onclick - Funcion que se ejecuta al hacer click
 * @param {Function} onmousedown - Funcion que se ejecuta al hacer mousedown
 * @param {Function} onmouseup - Funcion que se ejecuta al hacer mouseup
 * @param {Function} clickout - Funcion que se ejecuta al hacer click fuera del elemento
*/
function Tappable(){

    let elem ;
    let clickout;


    function checkclickout(e){
        if (!elem.contains(e.target) ) {
            e.redraw = true
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

                    if(vnode.attrs.onhover){
                        vnode.attrs.onhover(true)
                    }
                },
                onmouseleave: (e)=> {
                    if(vnode.attrs.hover) {
                        Object.keys(vnode.attrs.hover).forEach(h => elem.style[h] = vnode.attrs.style && vnode.attrs.style[h] || '')
                    }

                    if(vnode.attrs.onhover){
                        vnode.attrs.onhover(false)
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
                class: vnode.attrs.class || vnode.attrs.className,
                role: vnode.attrs.role,
                "aria-haspopup": vnode.attrs["aria-haspopup"],
                "aria-expanded": vnode.attrs["aria-expanded"],
                onkeydown: vnode.attrs.onkeydown,
                style:{
                    cursor:'pointer', 
                    // para que no salga el highlight azul en mobile
                    "-webkit-tap-highlight-color": 'transparent',

                    ...vnode.attrs.style 
                },
                tabindex: vnode.attrs.tabindex,
                id: vnode.attrs.id,
                title: vnode.attrs.title,
                onclick: vnode.attrs.onclick
            }, vnode.children)
        }
    }
}

/**
 * Componente con funcionalidad drag and drop
 * @param {Function} ondrop - Funcion que se ejecuta al hacer drop 
 * @param {*} data - Datos que se pasan de un elemento a otro al hacer drop
*/
function Draggable() {

    function getTarget(e) {
        if (e.target.draggable)
            return e.target
        else
            return e.target.closest("[draggable]")
    }

    return {
        view: ({ attrs, children })=> {
            let { style={}, data, ondrop } = attrs

            return m("div", {
                style: {
                    ...style,
                    cursor: "grab"
                },
                draggable: true,
                ondrag: (e) => e.target.style['border'] = "1px solid #2878C1",
                ondragstart: (e) => {
                    e.dataTransfer.effectAllowed = 'move'
                    e.dataTransfer.setData('data', data)
                },
                ondragend: (e) => {
                    e.preventDefault()
                    e.target.style["border"] = style.border || "none"
                },
                ondrop: (e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    let _data = e.dataTransfer.getData('data')
                    let target = getTarget(e)
                    target.style["border"] = style.border || "none"
                    target.style["filter"] = "none"

                    if(ondrop && typeof ondrop == "function" ) ondrop(_data)
                },
                ondragover: (e) => {
                    e.preventDefault()
                    let target = getTarget(e)
                    target.style["filter"] = "brightness(0.8)"
                },
                ondragleave: (e) => {
                    e.preventDefault()
                    let target = getTarget(e)
                    target.style["filter"] = "none"
                }
            }, children)
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
 * @param {Integer} delay - Segundos de espera para la animación 
 * @param {bool} animateOnScroll - Si la animación debe activarse al hacer scroll
 * @param {Integer} duration - milisegundos
 * 
 */
function Animate() {
    let duration;
    let styleTimeout;

    let animations = {
        'scaleIn': {
            from: { transform: 'scale(0.7)', opacity:0.8 },
            to: { transform: 'scale(1)', opacity:1 },
            exit: {opacity: 0, transform: 'scale(0.8)'}
        },

        'fadeUpIn': {
            from: {
                opacity: 0,
                transform: 'translateY(20px)'
            },
            to: {
                opacity: 1,
                transform: 'translateY(0)'
            },
            exit: {
                opacity: 0,
                transform: 'translateY(20px)'
            }
        },

        'fadeIn': {
            from: {
                opacity: 0,
            },
            to: {
                opacity: 1,
            }
        },

        'opacity': {
            from: { opacity: 0 },
            to: { opacity: 1 }
        },

        'slideDown': {
            from: {
                display:'grid',
                gridTemplateRows:'0fr',
            },
            to: {
                display:'grid',
                gridTemplateRows:'1fr'
            },
            exit: {
                display:'grid',
                gridTemplateRows:'0fr',
            },

        },
    }

    let observer;

    return {
        oncreate: ({attrs, dom})=> {
            let { animate={}, to={}, style={}, name = {}, animateOnScroll, delay = 10 } = attrs

            if(Object.keys(animate).length == 0){
                animate = to
            }


            if(animateOnScroll){
                observer = new IntersectionObserver((entries) => { // esto tal vez gasta mucha memoria !!
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            setTimeout(()=> {
                                // Animacion de entrada
                                Object.keys(animate).forEach(a => {
                                    dom.style[a] = animate[a] 
                                })
                            }, delay)
                            observer.disconnect()
                        }
                    })
                }, { threshold: 0.1 })
                    
                observer.observe(dom)
            } else {
                setTimeout(()=> {
                    // Animacion de entrada
                    Object.keys(animate).forEach(a => {
                        dom.style[a] = animate[a] 
                    })
                }, delay)
            }

            if(attrs.oncreate) attrs.oncreate({attrs, dom})

            // porque los estilos default se añaden al animar ??
            /*if(style && Object.keys(style).length > 0){
                styleTimeout=setTimeout(()=> {
                    Object.keys(style).forEach(a => {
                        dom.style[a] = style[a] 
                    })
                }, duration)
            }*/

        },
        onbeforeremove: ({ attrs, dom })=> {
            let { exit={}, cancelExit} = attrs

            console.log('EXIT', exit)

            if(!exit || cancelExit){
                return true;
                
            }
            
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

            if(attrs.animation){
                let animation = animations[attrs.animation] || {}
                
                attrs.from = {
                    ...(animation.from || {}),
                    ...(attrs.from || {})
                }

                attrs.to = {
                    ...(animation.to || {}),
                    ...(attrs.to || {})
                }
                
                attrs.exit = {
                    ...(animation.exit || {}),
                    ...(attrs.exit || {})
                }
            }

            return m("div", {
                id: attrs.id,
                title: attrs.title,
                role: attrs.role,
                tabindex: attrs.tabindex,

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

                onclick: (e)=> {
                    if(attrs.onclick && typeof attrs.onclick == "function") attrs.onclick(e)
                },
                onkeydown: (e)=> {
                    if(attrs.onkeydown && typeof attrs.onkeydown == "function") attrs.onkeydown(e)
                },

                style: {
                    ...attrs?.style,
                    ...attrs?.from,
                    transition: attrs.transition || `${duration}ms`
                },
                class: attrs?.class || attrs?.className || ''
            }, children)
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
