const S = {
    card: { 
        background:"#fff", 
        border:"1px solid #F0F0F0", 
        borderRadius:14, 
        padding:"20px 24px" 
    },
    metricCard: { 
        background:"#FAFAFA", 
        border:"1px solid #F0F0F0", 
        borderRadius:12, 
        padding:"16px 20px" 
    },
    badge: (color, bg) => ({ 
        background:bg, color, 
        fontSize:11, 
        fontWeight:600, 
        padding:"3px 8px", 
        borderRadius:6, 
        display:"inline-block", 
        letterSpacing:"0.3px" 
    }),
    btn: { 
        background:"#111", 
        color:"#fff", 
        border:"none", 
        borderRadius:8, 
        padding:"8px 16px", 
        fontSize:13, 
        fontWeight:500, 
        cursor:"pointer", 
        transition:"opacity 0.15s" 
    },
    btnOutline: { 
        background:"transparent", 
        color:"#555", 
        border:"1px solid #E0E0E0", 
        borderRadius:8, 
        padding:"7px 14px", 
        fontSize:13, 
        fontWeight:500, 
        cursor:"pointer" 
    },
    input: { 
        border:"1px solid #E8E8E8", 
        borderRadius:8, 
        padding:"8px 12px", 
        fontSize:13, 
        outline:"none", 
        width:"100%", 
        boxSizing:"border-box", 
        background:"#FAFAFA", 
        color:"#111" 
    },
    select: { 
        border:"1px solid #E8E8E8", 
        borderRadius:8, 
        padding:"7px 10px", 
        fontSize:13, 
        utline:"none", 
        background:"#FAFAFA", 
        color:"#111", 
        cursor:"pointer" 
    },
    label: { 
        fontSize:12, 
        fontWeight:500, 
        color:"#999", 
        letterSpacing:"0.5px", 
        textTransform:"uppercase", 
        marginBottom:4, 
        display:"block" 
    },
};

export default S;