import { FlexCol, FlexRow, Box, Div, Tappable  } from "./layout.js"
import { Text, SmallText } from "./texts.js"
import { Icon, Button } from './elements.js'
import { config } from "./config.js"


export {
    FormLabel, Input, TranslationInput, Dropdown,
    IntegerInput, Switch, InfoTooltip, Checkbox,
    HtmlDropdown, DateSelector
}



// repensar si añadir localize a estas funciones !!
function FormLabel(){
    let labelStyle = {
        fontWeight:'normal',
        display: 'block',
        color: 'black',
        fontSize: '1em',
        fontFamily: config.fontFamily,
        marginBottom: '0.2em',
        whiteSpace: 'normal',
    }


    return {
        view:(vnode)=>{
            let { required, info} = vnode.attrs

            if(config.formLabel && typeof config.formLabel == 'object'){
                Object.assign(labelStyle, config.formLabel)
            }
            
            return [
                m(FlexRow,
                    // añadido typeof en caso de que se pase la string con es/va
                    m("label",{ style:labelStyle }, typeof vnode.children?.[0] == 'object' ? null : vnode.children ),
                    required ? m("span", {style:"color:red; font-weight:bold;margin-left:0.5em;"}, '*'): null,

                    info 
                    ? m(InfoTooltip,{text:info})
                    : null
                )
                
            ]
        }
    }
}


// estilos básicos comunes, se pueden sobreescribir desde config (falta programar)
let baseStyle = {
    lineHeight: '1.21428571em',
    fontSize: '1em',
    background: '#fff',
    padding: '.67857143em 1em',
    borderRadius: '.28571429rem',
    border: '1px solid #ccc',
    color: 'rgba(0, 0, 0, .87)',
}


let focusedStyle = {
    border: '1.2px solid grey',
    boxShadow: '0 0 0 0 transparent inset, 0 0 0 0 transparent',
}


function Checkbox(){

    let checkboxStyle = {
        width:'17px', 
        height:'17px',
        cursor:'pointer',
    }

    return {
        view:(vnode)=>{
            let {data, name, onchange,label, checked, vertical=false} = vnode.attrs

            return [
                m(FlexRow, { alignItems: "center", flexDirection: vertical ? "column-reverse" : "row" },
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
                    m(Box,{width:'0.5em'}),

                    m("label", label)
                )
            ]
        }
    }
}


function Input(){
    
    return {
        oninit:(vnode)=> {
            if(config.form && config.form.baseStyle){
                Object.assign(baseStyle, config.form.baseStyle)
            }
        },
        view: (vnode)=>{
            let { data, name, oninput, type, label, required, rows, readonly, pattern, title, onchange, placeholder, value, info, onkeyup} = vnode.attrs

            return [

                // TO DO: editar el estilo de focus
                /*m("style", `
                    input, textarea > :focus, textarea:focus {
                        border: ${focusedStyle.border} !important;
                        box-shadow: ${focusedStyle.boxShadow} !important;
                    }    
                `),*/

                m(FlexCol,{ width:'100%'}, // pensar otra manera sin necesidad de meter width: 100%

                    label ? 
                    [
                        m(FormLabel,{required: required, info:info}, label),
                        //m(Box,{height:'0.2em'})
                    ] : null,

                    m(type =='textarea'? "textarea": "input", {
                        readonly: readonly || false,
                        rows:rows,
                        style:  {
                            ...baseStyle,
                            ...(vnode.attrs.style || {})
                        },
                        oninput:(e)=>{
                            oninput ? oninput(e): ''
                            data && name ? data[name] = e.target.value : ''
                        },
                        /*
                        onfocus:(e)=> {
                            e.target.style.border = focusedStyle.border
                            e.target.style.boxShadow = focusedStyle.boxShadow
                        },*/
                        ...( value ? {value:value}:{} ),
                        ...( data && data[name] ? {value:data[name]}:{} ),
                        ...type && type != 'textarea' ? {type:type}: {},
                        ...vnode.attrs.min && vnode.attrs.max ? {min:vnode.attrs.min, max:vnode.attrs.max}: {},
                        ...vnode.attrs.minlength && vnode.attrs.maxlength ? {minlength:vnode.attrs.minlength, maxlength:vnode.attrs.maxlength}: {},
                        ...pattern ? {pattern: pattern} : {},
                        ...(vnode.attrs.id ? { id: vnode.attrs.id }: {}),
                        ...title ? {title: title} : {},
                        ...placeholder ? {placeholder: placeholder} : {},
                        ...onkeyup ? {onkeyup: onkeyup} : {},
                        onchange:(e)=>{
                            if(onchange) onchange(e)
                        },
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
            let {data, name} = vnode.attrs
            if(vnode.attrs.languages){
                languages = vnode.attrs.languages.map((e)=> e.id || e)
            }

            if(vnode.attrs.initialLang){
                selectedlang = languages.findIndex((e)=> e == vnode.attrs.initialLang) || 0
            }

            if(data && name && data[name] && typeof data[name] == "object" && !data[name]?.[languages[selectedlang]]) {
                for(let i = 0; i < languages.length; i++) {
                    if(data[name]?.[languages[i]]) {
                        selectedlang = i
                        return
                    }
                }
            }
        },
        view:(vnode)=>{
            let {data, name, label, required, type, rows, info} = vnode.attrs

            if(!data) data = {}
            if(!name) name = 'translation'
            if(!data[name]){
                data[name] = {}
            } else if(typeof data[name] == 'string'){
                data[name] = {'es':data[name]}
            }

            
            return m(FlexCol, { width:'100%' }, // quitar 100%

                label ? m(FormLabel,{ required:required, info:info }, label) : null,

                m(FlexRow,
                    m(Input,{
                        style: { flexGrow:1, marginRight:'0.5em'},
                        rows: rows,
                        required:required,
                        data: data[name],
                        name: languages[selectedlang],
                        type: type,
                    }),
                    
                    m(Button,{
                        type:'default',
                        style:{ borderRadius:'0em',border:'1px solid #22242626', flexGrow:1, background:'white'},
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
        padding:'.67857143em 1em',
        border:'1px solid lightgrey',
        borderRadius:'0.5em',
        cursor:'pointer',
        display:'flex',
        justifyContent:'space-between',
        alignItems:'center'
    }

    return {
        view:(vnode)=>{
            let { data, name, label,  onchange, info, required, value, style={}} = vnode.attrs


            return [

                m(FlexCol,{width:'100%', ...vnode.attrs.style},
                    label ? m(FormLabel,{info:info, required:required}, label): null,

                    m("select",{
                        style: {
                            ...baseStyle
                        },
                        onchange:(e)=>{
                            data && name !=undefined ? data[name] = e.target.value: ''
                            onchange ? onchange(e.target.value) : ''
                            m.redraw()
                        }
                    },
                        m("option",{ disabled:true, selected:true },"Selecciona una opción"),

                        vnode.children.map((o)=> m("option",{
                            value: o.value != undefined ? o.value : o, 
                            selected: data && name != undefined 
                                ? typeof o == 'object' 
                                ? data[name] == o.value 
                                : data[name] == o 
                                : value
                        }, o.label || o))
                    )
                )
            ]
        }
    }
}


function DateSelector() {
    let open = false;

    return {
        view: (vnode) => {
            let { data, name, label, onchange} = vnode.attrs

            return [
                m(FlexCol,
                    m(FormLabel, label),

                    m(Tappable, {
                        onclick:(e)=> {
                            open = !open
                        },
                        style: {
                            ...baseStyle,
                            position: 'relative',
                            cursor: 'pointer',
                        }
                    },  
                        m(FlexRow, { justifyContent:'space-between', alignItems:'center'},
                            m(Text,{
                                maxWidth:'80%',
                                overflow:'hidden',
                                textOverflow:'ellipsis',
                                whiteSpace:'nowrap',
                                color: data && name && data[name] ? 'black' : 'grey',
                            },  
                                data && name && data[name] ? new Date(data[name]).toDateString() :
                                "Selecciona fecha"
                            ),     

                            m(Icon, {
                                icon: 'calendar_today',
                                color:'rgba(34, 36, 38)'
                            })
                        ),

                        open ? 
                        m(Div, {
                            position: 'absolute',
                            left:'0px',
                            top:'100%',
                            right: '0px',
                            boxShadow: '0 2px 4px 0 rgba(34,36,38,.12),0 2px 10px 0 rgba(34,36,38,.15)',
                            background:'#fff',
                            zIndex:1000,
                            marginTop:'0.2em',
                            padding:'1em',
                        },
                            m(DatePicker)

                        ): null,
                    )
                )
            ]
        }
    }


    function DatePicker(){ 

        let view = 'year' // days, month, years

        let selectedDate = new Date();

        return { 
            view: (vnode)=> {
                return m(FlexCol,
                    m(Text, "Date Picker Placeholder"),

                    view == 'year' ? 
                    m(Button, {
                        onclick:()=> view = 'months'
                    }, "Go to months view")
                    : null


                        
                )
            }
        }

    }
}


// dropdown sin utilizar el select html
function HtmlDropdown() {
    let open = false;

    return {
        view: (vnode) => {
            let { data, name, label, onchange} = vnode.attrs

            return [
                m(FlexCol,
                    m(FormLabel, label),

                    m(Tappable, {
                        style: {
                             ...(open 
                            ? {
                                borderBottomLeftRadius:'0em',
                                borderBottomRightRadius:'0em',
                            } : {}),
                            ...baseStyle,
                            position: 'relative'
                        },
                        onclick:(e)=> open = !open
                    },
                        m(FlexRow, { justifyContent:'space-between', alignItems:'center'},
                            
                            m(Text, {
                                maxWidth:'80%',
                                overflow:'hidden',
                                textOverflow:'ellipsis',
                                whiteSpace:'nowrap',
                                color:  data && name && data[name] ? 'black' : 'grey',

                            }, data && name && data[name] ? data[name] : 'Selecciona'),

                            // is there a built-in icon without using a library??

                            m(Icon, { icon: open ? 'keyboard_arrow_up' : 'keyboard_arrow_down', color:'rgba(34, 36, 38)' }
                        )),

                        open ?
                        m(FlexCol, {
                            border:'1px solid #ccc',
                            borderRadius:'0.5em',
                            borderTopLeftRadius:'0em',
                            borderTopRightRadius:'0em',
                            position: 'absolute',
                            left:'0px',
                            top:'100%',
                            right: '0px',
                            boxShadow: '0 2px 4px 0 rgba(34,36,38,.12),0 2px 10px 0 rgba(34,36,38,.15)',
                            background:'#fff',
                            zIndex:1000,
                        }, vnode.children.map((o)=>
                            m(Tappable, {
                                style: {
                                    padding: '0.5em 1em',
                                    cursor: 'pointer',
                                },
                                hover: {
                                    background: '#f0f0f0'
                                },
                                onclick:(e)=>{
                                    e.preventDefault()
                                    e.stopPropagation()

                                    if(data && name != undefined) {
                                        data[name] = o.value != undefined ? o.value : o
                                    }

                                    open = !open

                                    if(onchange) onchange(o)
                                        
                                    open = false
                                }
                            }, m(SmallText, o.label || o))
                        ))
                        : null
                
                    )

                )

            ]
        }
    }
}




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

                label && m(Text, label)
            )
        }
    }
}


// input that only gets integers
function IntegerInput(){ 

    let on = false;

    return {
        view: (vnode)=>{
            let { data, name, max, min=0, label, onchange, jump=1, required, style = {} } = vnode.attrs
            
            return [
                m(FlexCol,
                    label ? m(FormLabel, {required:required}, label) : null,


                    m("div",{
                        style: {
                            ...baseStyle,
                            ...style
                        }
                    }, 
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
                    },m.trust(text || vnode.children))
                )
            ]
        }
    }
}