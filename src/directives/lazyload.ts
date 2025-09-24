const lazyload = {
    mounted(el: HTMLElement) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                console.log(entry)
                if (entry.isIntersecting) {
                    const img = entry.target as HTMLImageElement
                    img.src = img.dataset.src || ''
                    observer.unobserve(img)
                }
            })
        })
        observer.observe(el)
    },
}

export default lazyload
