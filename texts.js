
export { H1, H2, Text, SmallText}


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
    return { 
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
