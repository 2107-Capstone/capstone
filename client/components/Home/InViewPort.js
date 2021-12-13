import { useEffect, useState } from 'react'

const InViewPort = (element, rootMargin) => {
    const [isVisible, setState] = useState(false);
    console.log(element)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setState(entry.isIntersecting);
                    observer.unobserve(element.current);
                }
            }, { rootMargin }
        );

        element && observer.observe(element);

        return () => observer.unobserve(element);
    }, []);

    return isVisible;
}
export default InViewPort
