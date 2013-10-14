//------------------------------------------------------------------------------
function Init()
{
    if(!window.File || !window.FileReader)
    {
        $("html").html("Your browser doesn't support HTML5 File APIs");
        return;
    }

    $("#ccL").change("ccL",LoadData);
    $("#ccR").change("ccR",LoadData);
    $("#M").change("M",LoadData);
    $("#go").click(main);

    $("#divL").dblclick(ClearPick);
    $("#divR").dblclick(ClearPick);
}
//------------------------------------------------------------------------------
var ccL; // node centers for left graph
var ccR; // node centers for right graph
var M;   // matched right graph nodes
//------------------------------------------------------------------------------
function LoadData(event)
{
    var opt = event.data;

    var file   = event.target.files[0];
    var reader = new FileReader();

    reader.onload = function(ev)
    {
        buff = ev.target.result;
        switch(opt)
        {
        case "ccL":
            buff = $.parse(buff,{delimiter:"\t",header:false,dynamicTyping:true});
            if(buff.errors.length>0)
            {
                alert("Read "+file.name+" failed.");
                return;
            }
            ccL = buff.results;
            break;
        case "ccR":
            buff = $.parse(buff,{delimiter:"\t",header:false,dynamicTyping:true});
            if(buff.errors.length>0)
            {
                alert("Read "+file.name+" failed.");
                return;
            }
            ccR = buff.results;
            break;
        case "M":
            buff = $.parse(buff,{delimiter:"\t",header:false,dynamicTyping:true});
            if(buff.errors.length>0)
            {
                alert("Read "+file.name+" failed.");
                return;
            }
            M = buff.results;
            for(var i=0;i<M.length;i++)
                M[i] = M[i][0];
            break;
        }
    };
    
    reader.readAsText(file);
}
//------------------------------------------------------------------------------
var paperL;
var paperR;
//------------------------------------------------------------------------------
function DrawLabel()
{
    if(paperL==undefined || paperR==undefined)
        return;
    
    for(var i=0;i<ccL.length;i++)
    {
        var t = paperL.text(ccL[i][0],ccL[i][1],i.toString());
        t.attr("stroke","#f00");
    }
    for(var i=0;i<ccR.length;i++)
    {
        var t = paperR.text(ccR[i][0],ccR[i][1],i.toString());
        t.attr("stroke","#00f");
    }
}
//------------------------------------------------------------------------------
function DrawCompare()
{
    if(paperL==undefined || paperR==undefined)
        return;

    var i = 0;
    
    for(;i<ccL.length;i++)
    {
        var tL,tR;
        
        var m = M[i];
        if(m<ccR.length)
        {
            tL = paperL.text(ccL[i][0],ccL[i][1],i.toString());
            tR = paperR.text(ccR[m][0],ccR[m][1],i.toString());

            tL.attr("stroke","#000");
            tR.attr("stroke","#000");
        }
        else
        {
            tL = paperL.text(ccL[i][0],ccL[i][1],i.toString());
            tL.attr("stroke","#f00");
        }

        tL.node.id      = "L"+i;
        tL.node.onclick = DrawPick;
        
        if(m<ccR.length)
        {
            tR.node.id      = "R"+m;
            tR.node.onclick = DrawPick;
        }
    }
    for(var j=0;j<ccR.length;j++)
    {
        var inxL = M.indexOf(j);
        if(inxL>=ccL.length)
        {
            var t = paperR.text(ccR[j][0],ccR[j][1],i.toString());
            t.attr("stroke","#00f");
            
            t.node.id      = "R"+j;
            t.node.onclick = DrawPick;
            
            i ++;
        }
    }
}
//------------------------------------------------------------------------------
var pickA,pickB;
//------------------------------------------------------------------------------
function DrawCircle(paper,x,y,r)
{
    var c = paper.circle(x,y,r);
    c.attr("stroke","#000");
    c.attr("stroke-width",100);
    c.attr("stroke-opacity",0.5);
    return c;
}
//------------------------------------------------------------------------------
function DrawPick(event)
{
    ClearPick();
    
    var onL = ( event.currentTarget.id.search(/^L/) >= 0 );
    var inx = event.currentTarget.id.match(/[0-9]+/);

    inx = parseInt(inx[0]);

    var tA,tB;
    var paperA,paperB;
    var inxA,inxB;

    inxA = inx;
    tA   = $(event.currentTarget);
    
    if(onL)
    {
        paperA = paperL;
        paperB = paperR;

        inxB = M[inxA];

        if(inxB < ccR.length)
            tB = $("#R"+inxB);
    }
    else
    {
        paperA = paperR;
        paperB = paperL;

        inxB = M.indexOf(inxA);

        if(inxB>=0 && inxB<ccL.length)
            tB = $("#L"+inxB);
    }

    if(tA.length)
        pickA = DrawCircle(paperA,tA.attr("x"),tA.attr("y"),20);
    if(tB.length)
        pickB = DrawCircle(paperB,tB.attr("x"),tB.attr("y"),20);
}
//------------------------------------------------------------------------------
function ClearPick()
{
    if(pickA != undefined)
        pickA.remove();
    if(pickB != undefined)
        pickB.remove();
}
//------------------------------------------------------------------------------
function main()
{
    if(ccL == undefined)
    {
        alert("Nodes in left graph are missing.");
        return;
    }
    if(ccR == undefined)
    {
        alert("Nodes in right graph are missing.");
        return;
    }
    if(M == undefined)
    {
        alert("Match results are missing.");
        return;
    }

    if(paperL == undefined && paperR == undefined)
    {
        var imgL = $("#imgL");
        var imgR = $("#imgR");
        
        imgL.error(function(){alert("Left image is not loaded.")});
        imgR.error(function(){alert("Right image is not loaded.")});

        paperL = Raphael("divL",imgL.width(),imgL.height());
        paperR = Raphael("divR",imgR.width(),imgR.height());
    }
    else
    {
        paperL.clear();
        paperR.clear();
    }
    
    DrawCompare();
}
//------------------------------------------------------------------------------
