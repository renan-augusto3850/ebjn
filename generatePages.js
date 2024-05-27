function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
console.log("<div id='flipbook'>");
async function here() {
    console.log(`   <div><img class='page' src='/PAGES/aceita-me/${i}.jpg'></div>`);
    await sleep(100);
}
for(var i = 1; i < 133; i++){
   here().then(() => {
       console.log("</div>")
   })
}