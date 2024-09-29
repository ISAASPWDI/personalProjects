export function uploader(){
    const $uploader = document.querySelector('.uploader');
    const $inputFile = document.getElementById('files');
    //Función expresada
    async function upload(file) {
        const res = await fetch('',{
            method: 'POST',
            body: file,
            headers: {
                'Content-Type': 'application/octet-stream',
            }
        }),
        formData = new FormData();

        formData.append('file', file);
        
        
    }
    document.addEventListener('change',(e)=>{
        if (e.target === $inputFile) {
            console.log(e.target.files);

            const files = Array.from(e.target.files);
            files.forEach(file => {

            });
        }
    });
}

