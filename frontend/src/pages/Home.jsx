import React,{useEffect,useRef,useState} from "react";
import styles from "../index.module.css";
import Header from "../components/Header";

function Home() {
  const listRef = useRef(null);
  const itemsRef = useRef([]);
  const dotsRef = useRef([]);
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  // const [product,setProduct] = useState([]);
  const [active, setActive] = useState(0);

  // useEffect(()=>{

  // })

  useEffect(()=>{
    if (!listRef.current || itemsRef.current.length === 0) return;

    const updateSlider = () => {
      let checkLeft = itemsRef.current[active]?.offsetLeft || 0;
      listRef.current.style.left = -checkLeft + "px";

      document
        .querySelector(`.${styles.ImageSlider} .${styles.dots} li.${styles.active}`)
        ?.classList.remove(styles.active);

      dotsRef.current[active]?.classList.add(styles.active);
    };
    updateSlider();
  },[active]);


  useEffect(() => {
    const handleNext = () => {
      setActive((prev) => (prev + 1) % itemsRef.current.length);
    };
    
    const interval = setInterval(handleNext, 3000);

    return () => clearInterval(interval); // Dọn dẹp khi component unmount
  }, [active]); 


  useEffect(() => {
    const next = nextRef.current;
    const prev = prevRef.current;

    const handleNext = () => setActive((prev) => (prev + 1) % itemsRef.current.length);
    const handlePrev = () => setActive((prev) => (prev - 1 + itemsRef.current.length) % itemsRef.current.length);

    next?.addEventListener("click", handleNext);
    prev?.addEventListener("click", handlePrev);

    return () => {
      next?.removeEventListener("click", handleNext);
      prev?.removeEventListener("click", handlePrev);
    };
  }, []);
  return (

    <>
      <div className={styles.ImageSlider}>
        <div ref={listRef} className={styles.ListImage}>
          <div ref={(el) => itemsRef.current[0] = el} className={styles.item}>
            <img src="/Images/1.webp" alt=""/>
          </div>
          <div ref={(el) => itemsRef.current[1] = el} className={styles.item}>
            <img src="/Images/2.webp" alt=""/>
          </div>
          <div ref={(el) => itemsRef.current[2] = el} className={styles.item}>
            <img src="/Images/3.webp" alt=""/>
          </div>
          <div ref={(el) => itemsRef.current[3] = el} className={styles.item}>
            <img src="/Images/4.webp" alt=""/>
          </div>
        </div>
        <div className={styles.buttons}>
          <button ref={prevRef} id="prev"> &lt; </button>
          <button ref={nextRef} id="next"> &gt; </button>


        </div>
        <ul className={styles.dots}>
          <li ref={(el)=>dotsRef.current[0] = el}  className={styles.active}></li>
          <li ref={(el)=>dotsRef.current[1] = el}></li>
          <li ref={(el)=>dotsRef.current[2] = el}></li>
          <li ref={(el)=>dotsRef.current[3] = el}></li>
        </ul>
      </div>

      <div className={styles["product-container"]}>
        <div className={`${styles["product-item"]} ${styles.large}`}>
          <img src="/Images/image.png" alt=""/>
        </div>

        {

        }

        <div className={styles["product-item"]}>
          <img src="/Images/hong tra sua tran chau.webp" alt=""/>
          {/* <div className={styles["product-item_text"]}>
              <p>ABC</p>
              <p>10.000đ</p>
          </div> */}
        </div>
        <div className={styles["product-item"]}>
          <img src="/Images/bac xiu lac sua yen mach.webp" alt=""/>
        </div>
        <div className={styles["product-item"]}>
          <img src="/Images/mochi kem matcha.webp" alt=""/>
        </div>
        <div className={styles["product-item"]}>
          <img src="/Images/mochi kem tra sua tran chau.webp" alt=""/>
        </div>
      </div>
    </>
  );
}

export default Home;
