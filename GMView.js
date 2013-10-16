//------------------------------------------------------------------------------
function Init()
{
    if(!window.File || !window.FileReader)
    {
        $("html").html("Your browser doesn't support HTML5 File APIs");
        return;
    }

    $("#iL").change("iL",LoadImage);
    $("#iR").change("iR",LoadImage);
    
    $("#vL").change("vL",LoadData);
    $("#vR").change("vR",LoadData);
    $("#eL").change("eL",LoadData);
    $("#eR").change("eR",LoadData);

    $("#M").change("M",LoadData);

    $("#btGo").click(main);
    $("#btE").click(DrawEdge);
    $("#btEdel").click(ClearEdge);
    $("#btSave").click(Save);

    $("#visLv").dblclick(ClearPick);
    $("#visRv").dblclick(ClearPick);
}
//------------------------------------------------------------------------------
function LoadImage(event)
{
    var opt = event.data;

    var file   = event.target.files[0];
    var reader = new FileReader();

    reader.onload = function(ev)
    {
        var buff = ev.target.result;
        switch(opt)
        {
        case "iL":
            $("#imgL").remove();
            var img = $('<img id="imgL" src="'+buff+'">');
            img.appendTo("#visL");
            break;
        case "iR":
            $("#imgR").remove();
            var img = $('<img id="imgR" src="'+buff+'">');
            img.appendTo("#visR");
            break;
        }
    };

    reader.readAsDataURL(file);
}
//------------------------------------------------------------------------------
var vL,eL;
var vR,eR;
var M;
//------------------------------------------------------------------------------
function LoadData(event)
{
    var opt = event.data;

    var file   = event.target.files[0];
    var reader = new FileReader();

    reader.onload = function(ev)
    {
        var buff = ev.target.result;
        switch(opt)
        {
        case "vL":
            buff = $.parse(buff,{delimiter:"\t",header:false,dynamicTyping:true});
            if(buff.errors.length>0)
            {
                alert("Read "+file.name+" failed.");
                return;
            }
            vL = buff.results;
            break;
        case "vR":
            buff = $.parse(buff,{delimiter:"\t",header:false,dynamicTyping:true});
            if(buff.errors.length>0)
            {
                alert("Read "+file.name+" failed.");
                return;
            }
            vR = buff.results;
            break;
        case "eL":
            buff = $.parse(buff,{delimiter:"\t",header:false,dynamicTyping:true});
            if(buff.errors.length>0)
            {
                alert("Read "+file.name+" failed.");
                return;
            }
            eL = buff.results;
            for(var i=0;i<eL.length;i++)
            {
                eL[i][0]--;
                eL[i][1]--;
            }
            break;
        case "eR":
            buff = $.parse(buff,{delimiter:"\t",header:false,dynamicTyping:true});
            if(buff.errors.length>0)
            {
                alert("Read "+file.name+" failed.");
                return;
            }
            eR = buff.results;
            for(var i=0;i<eR.length;i++)
            {
                eR[i][0]--;
                eR[i][1]--;
            }
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
                M[i] = M[i][0] - 1; // assume indexes in M start from 1
            break;
        }
    };
    
    reader.readAsText(file);
}
//------------------------------------------------------------------------------
var paperLv,paperLe;
var paperRv,paperRe;
//------------------------------------------------------------------------------
function DrawLabel()
{
    if(paperLv==undefined || paperRv==undefined)
        return;
    
    for(var i=0;i<vL.length;i++)
    {
        var t = paperLv.text(vL[i][0],vL[i][1],i.toString());
        t.attr("stroke","#f00");
    }
    for(var i=0;i<vR.length;i++)
    {
        var t = paperRv.text(vR[i][0],vR[i][1],i.toString());
        t.attr("stroke","#00f");
    }
}
//------------------------------------------------------------------------------
function DrawCompare()
{
    if(paperLv==undefined || paperRv==undefined)
        return;

    var i = 0;
    
    for(;i<vL.length;i++)
    {
        var tL,tR;
        
        var m = M[i];
        if(m<vR.length)
        {
            tL = paperLv.text(vL[i][0],vL[i][1],i.toString());
            tR = paperRv.text(vR[m][0],vR[m][1],i.toString());

            tL.attr("stroke","#000");
            tR.attr("stroke","#000");
        }
        else
        {
            tL = paperLv.text(vL[i][0],vL[i][1],i.toString());
            tL.attr("stroke","#f00");
        }

        tL.node.id      = "L"+i;
        tL.node.onclick = DrawPick;
        
        if(m<vR.length)
        {
            tR.node.id      = "R"+m;
            tR.node.onclick = DrawPick;
        }
    }
    for(var j=0;j<vR.length;j++)
    {
        var inxL = M.indexOf(j);
        if(inxL>=vL.length)
        {
            var t = paperRv.text(vR[j][0],vR[j][1],i.toString());
            t.attr("stroke","#00f");
            
            t.node.id      = "R"+j;
            t.node.onclick = DrawPick;
            
            i ++;
        }
    }
}
//------------------------------------------------------------------------------
function DrawEdge()
{
    if(paperLe==undefined || paperRe==undefined)
        return;

    if(eL == undefined)
    {
        alert("Edges in left graph are missing.");
        return;
    }
    if(eR == undefined)
    {
        alert("Edges in right graph are missing.");
        return;
    }

    for(var i=0;i<eL.length;i++)
    {
        var x0 = vL[eL[i][0]][0];
        var y0 = vL[eL[i][0]][1];
        var x1 = vL[eL[i][1]][0];
        var y1 = vL[eL[i][1]][1];

        var l = paperLe.path("M"+x0+","+y0+"L"+x1+","+y1);
        l.attr("stroke","#009f75");
        l.attr("stroke-width",2);
    }
    for(var i=0;i<eR.length;i++)
    {
        var x0 = vR[eR[i][0]][0];
        var y0 = vR[eR[i][0]][1];
        var x1 = vR[eR[i][1]][0];
        var y1 = vR[eR[i][1]][1];

        var l = paperRe.path("M"+x0+","+y0+"L"+x1+","+y1);
        l.attr("stroke","#009f75");
        l.attr("stroke-width",2);
    }
}
//------------------------------------------------------------------------------
function ClearEdge()
{
    if(paperLe != undefined)
        paperLe.clear();
    if(paperRe != undefined)
        paperRe.clear();
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
        paperA = paperLv;
        paperB = paperRv;

        inxB = M[inxA];

        if(inxB < vR.length)
            tB = $("#R"+inxB);
    }
    else
    {
        paperA = paperRv;
        paperB = paperLv;

        inxB = M.indexOf(inxA);

        if(inxB>=0 && inxB<vL.length)
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
function img2svg(id)
{
    var tag = $(id);
    var svg = "<image width=\""+tag.width()+"\" height=\""+tag.height()+"\" xlink:href=\""+tag.attr("src")+"\"/>";
    return svg;
}
//------------------------------------------------------------------------------
function Save()
{
    if(paperLv==undefined || paperRv==undefined)
        return;

    var svgL = "<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\">";
    svgL += img2svg("#imgL") + "\n";
    svgL += paperLv.toSVG() + "\n";
    svgL += "</svg>";

    var svgR = "<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\">";
    svgR += img2svg("#imgR") + "\n";
    svgR += paperRv.toSVG() + "\n";
    svgR += "</svg>";

    var bin = btoa(unescape(encodeURIComponent(svgL)));
    $("#lnkL").remove();
    var lnk = $('<p><a id="lnkL" href-lang="image/svg+xml" href="data:image/svg+xml;base64,'+bin+'">Left Image</a></p>');
    lnk.appendTo("#command");

    var bin = btoa(unescape(encodeURIComponent(svgR)));
    $("#lnkR").remove();
    var lnk = $('<p><a id="lnkR" href-lang="image/svg+xml" href="data:image/svg+xml;base64,'+bin+'">Right Image</a></p>');
    lnk.appendTo("#command");
}
//------------------------------------------------------------------------------
function main()
{
    if(vL == undefined)
    {
        alert("Vertexes in left graph are missing.");
        return;
    }
    if(vR == undefined)
    {
        alert("Vertexes in right graph are missing.");
        return;
    }
    if(M == undefined)
    {
        alert("Match results are missing.");
        return;
    }

    if(paperLv == undefined && paperRv == undefined)
    {
        var imgL = $("#imgL");
        var imgR = $("#imgR");
        
        imgL.error(function(){alert("Left image is not loaded.")});
        imgR.error(function(){alert("Right image is not loaded.")});

        paperLv = Raphael("visLv",imgL.width(),imgL.height());
        paperRv = Raphael("visRv",imgR.width(),imgR.height());
    }
    else
    {
        paperLv.clear();
        paperRv.clear();
    }

    if(paperLe == undefined && paperRe == undefined)
    {
        var imgL = $("#imgL");
        var imgR = $("#imgR");
        
        imgL.error(function(){alert("Left image is not loaded.")});
        imgR.error(function(){alert("Right image is not loaded.")});

        paperLe = Raphael("visLe",imgL.width(),imgL.height());
        paperRe = Raphael("visRe",imgR.width(),imgR.height());
    }
    else
    {
        paperLe.clear();
        paperRe.clear();
    }
    
    DrawCompare();
}
//------------------------------------------------------------------------------
