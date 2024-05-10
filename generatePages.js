console.log("<div id='flipbook'>");
async function here() {
    console.log(`   <div><img class='page' src='/PAGES/estilhaca-me/${i}.jpg'></div>`);
    await sleep(100);
}
for(var i = 1; i < 292; i++){
   here().then(() => {
       console.log("</div>")
   })
}