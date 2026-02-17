import { config } from "./config.js"
import { Div, FlexRow, Tappable, FlexCol, Animate, Box } from "./layout.js"
import { Text, SmallText, H2 } from "./texts.js"


export { 
    Segment,  Span, RippleEffect,
    Button, Icon, Img,    
    Sidebar, Label, 
    Message,  Card,  Checkbox, Spinner, 
    BreadCrumb,
    Table, TableHead, TableBody, TableRow, TableCell, TableFooter,
    SVGIcon
}



// cachea la imagen al mostrarse
function Img(){
    let image = new Image()


    return {
        oninit: (vnode)=>{
            image.src = vnode.attrs.src
        },
        view:(vnode) => {
            return [
                m("img",{
                    src: image.src,
                    id: vnode.attrs.id,
                    style: vnode.attrs.style,
                    onload: vnode.attrs.onload,
                    alt: vnode.attrs.alt
                })
            ]
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
            let {type='default'} = vnode.attrs || {}

            console.log('config', config.elements?.segment)

            return m(Div,{
                padding:'1rem',
                borderRadius: '1em',
                transition: 'all .2s ease',
                ...types[type] || types.primary,
                ...(vnode.attrs?.basic && {border: 'none'}),
                ...(vnode.attrs?.attach && attach[vnode.attrs.attach]),
                ...(vnode.attrs?.raised && { 
                    boxShadow: '0 2px 4px rgba(34, 36, 38, .12), 0 2px 10px rgba(34, 36, 38, .15)'
                }),
                ...(config.elements?.segment || {}),
                ...(vnode.attrs?.style || vnode.attrs)
            },
            vnode.children)
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
        tableLayout: "auto",
        color: "rgba(0,0,0,.87)",
        borderCollapse: "separate",
        borderSpacing: "0",
        borderRadius:'1em'
    }

    return {
        view:(vnode)=>{
            return m("table",{
                style:{ 
                    ...tableStyle, 
                    ...config.elements?.table?.table || {},
                    ...vnode.attrs.style
                },
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
        lineHeight:2,
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
                style: {
                    ...style,
                    ...config.elements?.table?.head || {},
                    ...vnode.attrs.style
                }
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
                    ...config.elements?.table?.body || {},
                    ...vnode.attrs
                }
            }, vnode.children)
        }
    }
}

function TableFooter(){
    return {
        view: (vnode) => {
            return m("tfoot", {
                style: {
                    ...config.elements?.table?.footer || {},
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
                onclick: vnode.attrs.onclick ? vnode.attrs.onclick : null,
                style: {
                    textAlign:'left',
                    padding:'1em',
                    fontFamily: config.fontFamily,
                    ...config.elements?.table?.cell || {},
                    ...vnode.attrs
                }
            }, vnode.children)
        }
    }
}



// Div y Tappable son intercambiables ??
// mouseover, mouseout, clickout...
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




/*
* type: primary, secondary, danger
*/
function Button(){

    let types = {
        primary: config.button?.primary || {
            color: 'white',
            //border: '1px solid white',
            background: '#1b1c1d'
        },
        secondary: config.button?.secondary ||
        {
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
            minHeight:'30px',
            minWidth:'30px'
        },
        default: {
            paddingLeft:`1.5em`,
            paddingRight:'1.5em',
            fontSize:'1em',
            minHeight:'40px',
            minWidth:'40px'
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
                    fontFamily: config.fontFamily,
                    minHeight:'40px',
                    width: fluid ? '100%': 'auto',
                    userSelect:'none',
                    filter:`brightness(${brightness}%)`,
                    borderRadius:'1em',
                    gap: "5px",
                    ...disabled && {
                        opacity:'0.5',
                        cursor: 'not-allowed',
                        boxShadow:'none'
                    },
                    ...types[type] || types.primary,
                    ...config.elements?.button,
                    ...sizes[vnode.attrs.size || 'default'],
                    ...vnode.attrs.style
                },
                onclick:!disabled && onclick,
                onmouseover:(e)=> !disabled && (brightness=80), // mejorar esto !!
                onmouseout:(e)=> (brightness=100),
                onmousedown:(e)=> (brightness=60),
                onmouseup:(e)=> (brightness=100),
            }, 
                icon ? [
                    m(Icon,{ icon:icon, size: size || 'small', color: "inherit" || types[type].color || "black" }),
                    // m(Box, { width:'5px' })
                ] : null,
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
        'large':'font-size:28px',
        'huge':'font-size:32px',
        'massive':'font-size:50px'
    }

    return {
        /*oninit:(vnode)=>{
            
        },*/
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


function Message(){

    let types = {
        'error': {
            background:'#fef2f2',
            color:'#B91C1C',
        },
        'info': {
            color:'black',
        }
    }
    

    // set different types 

    return {
        view:(vnode)=>{
            let { type='info' } = vnode.attrs

            return m(Segment,{
                    style: {
                        ...types[type] || {}
                    },
                    type:'secondary',
                }, 
                m(FlexRow, {alignItems: 'center', gap:'1em'},
                    m(Icon, {
                        icon:type=='error' ? 'error':'info', 
                        size: 'small', 
                        color: type == 'error' ? 'red': 'black'
                    }),

                    vnode.attrs.header || vnode.attrs.message ? 
                    m(FlexCol, 
                        
                        vnode.attrs.header && m(Text, {
                            marginBottom:'0.5em', 
                            fontWeight:'bold', 
                            
                        }, vnode.attrs.header),

                        vnode.attrs.message && 
                        m(Text, {
                            //color: type == 'error' ? '#7f1d1d': 'black'
                        }, vnode.attrs.message)

                    ) :
                    m(Text,{
                        //color: type == 'error' ? '#7f1d1d': 'black'
                    }, vnode.children )
                )
            )
        }
    }
}


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
        tertiary: {
            backgroundColor: "#e8e8e8",
            color: "#00000099",
            border: "1px solid #e8e8e8",
        },
        positive: {
            backgroundColor: "#dcfce7",
            color: "#166534",
            border: "1px solid #dcfce7"
        },
        negative: {
            backgroundColor: "#fee2e2",
            color: "#991b1b",
            border: "1px solid #fee2e2"
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
        'small': {
            fontSize:'0.6em',
        },
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
                        lineHeight: "1",
                        margin: "0 .14285714em",
                        backgroundImage: "none",
                        padding: ".5833em .833em",
                        textTransform: "none",
                        width:'fit-content',
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
                    onclick: vnode.attrs.onclick
                }, 
                    vnode.attrs.icon || vnode.attrs.text ? 
                    m(FlexRow, {gap:'0.5em', alignItems:'center'},
                        vnode.attrs.icon && m(Icon,{icon:vnode.attrs.icon, size:'small', color: types[type]?.color || 'white'}),
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
                        //height:'100%', width:'100%', // hay que meter la card siempre en un contenedor !!
                        border:'2px solid rgb(224, 224, 224)',
                        cursor:'pointer', background: type == 'secondary' ? '#e0e0e0': 'white', //border:'1px solid lightgrey',
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
                                "border-style": "none", "background":'white',
                                'border-top-left-radius':'1em', 'border-top-right-radius':'1em',         
                                willChange: 'transform', 
                                ...vnode.attrs.imgStyle
                            }}),

                            borderColor &&
                            m(Div, {
                                height:'2px',
                                background: `${borderColor}`,
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
                            }, item.label || item)),
                        
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
            return m(`.ui.right.sidebar${transition}`, // quitar css de semantic
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
            })
        }
    }
}




function SVGIcon(){

    const Icons = {
        arrow_left: [
            m("path", { d: "m12 19-7-7 7-7" }),
            m("path", { d: "M19 12H5" })
        ],
        calendar: [
            m("path", { d: "M8 2v4" }),
            m("path", { d: "M16 2v4" }),
            m("rect", { width: "18", height: "18", x: "3", y: "4", rx: "2" }),
            m("path", { d: "M3 10h18" })
        ],
        chevron_right: [
            m("path", { d: "m9 18 6-6-6-6" })
        ],
        chevron_left:[
            m("path", { d: "m15 18-6-6 6-6" })
        ],
        circle_check: [
            m("circle", { cx: "12", cy: "12", r: "10" }),
            m("path", { d: "m9 12 2 2 4-4" })
        ],
        circle_close: [

            m("circle",{cx:"12", cy:"12", r:"10"}),
            m("path",{d:"m15 9-6 6"}),
            m("path",{d:"m9 9 6 6"})
        ],
        clock: [
            m("circle", { cx: "12", cy: "12", r: "10" }),
            m("polyline", { points: "12 6 12 12 16 14" })
        ],
        close:[
            m("path", { d: "M18 6 6 18" }),
            m("path", { d: "m6 6 12 12" })
        ],
        edit: [
            m("path", { d: "M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" }),
            m("path", { d: "M18.375 2.625a1.5 1.5 0 1 1 2.121 2.121L12 13.243l-3 0.757 0.757-3Z" })
        ],
        edit_v2: [
            m("path", { d: "M12 20h9" }),
            m("path", { d: "M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" })
        ],
        eye_open:[
            m("path", { d: "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" }),
            m("circle", { cx: "12", cy: "12", r: "3" })
        ],
        eye_closed:[
            m("path", { d: "m4 4 16 16" }),
            m("path", { d: "M10.58 10.58a2 2 0 0 0 2.83 2.83" }),
            m("path", { d: "M9.88 5.09A10.94 10.94 0 0 1 12 5c4.5 0 8.27 2.94 9.54 7a10.66 10.66 0 0 1-2.38 3.88" }),
            m("path", { d: "M6.61 6.61A10.82 10.82 0 0 0 2.46 12a10.66 10.66 0 0 0 4.13 5.37" }),
            m("path", { d: "M14.12 14.12A3 3 0 0 1 9.88 9.88" })
        ],
        group: [
            m("circle", { cx: "12", cy: "8", r: "3" }),
            m("path", { d: "M6 20c0-3.313 2.686-6 6-6s6 2.687 6 6" }),
            m("circle", { cx: "5", cy: "9", r: "2" }),
            m("path", { d: "M1.5 20c0-2.2 1.8-4 4-4" }),
            m("circle", { cx: "19", cy: "9", r: "2" }),
            m("path", { d: "M22.5 20c0-2.2-1.8-4-4-4" })
        ],
        kiosk: [
            m("rect", { x: "5", y: "2", width: "14", height: "20", rx: "2" }),
            m("rect", { x: "8", y: "5", width: "8", height: "5", rx: "1" }),
            m("path", { d: "M8 14h8" }),
            m("path", { d: "M8 17h8" }),
            m("path", { d: "M9 22v-2" }),
            m("path", { d: "M15 22v-2" }),
            m("path", { d: "M3 18h2" }),
            m("path", { d: "M19 18h2" })
        ],
        mail: [
            m("path", { d: "m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" }),
            m("rect", { x: "2", y: "4", width: "20", height: "16", rx: "2" })
        ],
        map_pin: [
            m("path", { d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" }),
            m("circle", { cx: "12", cy: "10", r: "3" })
        ],
        phone: [
            m("path", { d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" })
        ],
        qr: [
            m("rect", { x: "3", y: "3", width: "6", height: "6", rx: "1" }),
            m("rect", { x: "15", y: "3", width: "6", height: "6", rx: "1" }),
            m("rect", { x: "3", y: "15", width: "6", height: "6", rx: "1" }),
            m("path", { d: "M11 11h2" }),
            m("path", { d: "M15 11h2" }),
            m("path", { d: "M11 15h2" }),
            m("path", { d: "M13 13h2" }),
            m("path", { d: "M17 15h2" }),
            m("path", { d: "M15 17h2" }),
            m("path", { d: "M19 19h2" })
        ],
        search: [
            m("path", { d: "m21 21-4.34-4.34" }),
            m("circle", { cx: "11", cy: "11", r: "8" })
        ],
        save: [
            m("path", { d: "M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" }),
            m("path", { d: "M17 21v-8H7v8" }),
            m("path", { d: "M7 3v5h8" })
        ],
        settings: [
            m("circle", { cx: "12", cy: "12", r: "3" }),
            m("path", { d: "M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.04 1.55V21a2 2 0 0 1-4 0v-.09a1.7 1.7 0 0 0-1.04-1.55 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.55-1.04H3a2 2 0 0 1 0-4h.05A1.7 1.7 0 0 0 4.6 8.92a1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34H9A1.7 1.7 0 0 0 10.04 3H10a2 2 0 0 1 4 0h-.04A1.7 1.7 0 0 0 15 4.56h.04a1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87V9A1.7 1.7 0 0 0 20.95 10H21a2 2 0 0 1 0 4h-.05A1.7 1.7 0 0 0 19.4 15z" })
        ],
        stats: [
            m("path", { d: "M3 3v18h18" }),
            m("rect", { x: "7", y: "13", width: "3", height: "5", rx: "1" }),
            m("rect", { x: "12", y: "10", width: "3", height: "8", rx: "1" }),
            m("rect", { x: "17", y: "7", width: "3", height: "11", rx: "1" })
        ],
        tv: [
            m("rect", { x: "2", y: "5", width: "20", height: "14", rx: "2" }),
            m("path", { d: "M8 21h8" }),
            m("path", { d: "M12 19v2" }),
            m("path", { d: "m9 2 3 3 3-3" })
        ],
        user: [
            m("circle", { cx: "12", cy: "8", r: "4" }),
            m("path", { d: "M4 21c0-4.418 3.582-8 8-8s8 3.582 8 8" })
        ],
        web: [
            m("circle", { cx: "12", cy: "12", r: "9" }),
            m("path", { d: "M3 12h18" }),
            m("path", { d: "M12 3a14 14 0 0 1 0 18" }),
            m("path", { d: "M12 3a14 14 0 0 0 0 18" }),
            m("path", { d: "M5.5 7.5h13" }),
            m("path", { d: "M5.5 16.5h13" })
        ],
        whatsapp: [
           m("path", {d:"M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"})
        ],
        X: [
            m("path", { d: "M18 6 6 18" }),
            m("path", { d: "m6 6 12 12" })
        ]

    }


    return {
        view: ({attrs}) => {
            const iconName = attrs.icon || "search"
            const iconNodes = Icons[iconName] || Icons.search

            return m("svg",{
                width: attrs.width || 18 ,
                height: attrs.height || attrs.width || 18,
                viewBox: "0 0 24 24",
                xmlns: "http://www.w3.org/2000/svg",
                fill: attrs.filled ? attrs.color : 'none',
                stroke: attrs.color || 'black',
                "stroke-width": attrs.strokeWidth || 2,
                "stroke-linecap": attrs.strokeLinecap || "round",
                "stroke-linejoin": attrs.strokeLinejoin || "round",
                style: attrs.style,
                onclick: attrs.onclick
            }, iconNodes)
        }
    }
}