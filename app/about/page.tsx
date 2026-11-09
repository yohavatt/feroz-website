import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { AboutSplitSection } from "@/components/about/AboutSplitSection";
import styles from "./page.module.css";

const LARGE_HEADING = "clamp(32px, 3.8vw, 46px)";
const SMALL_HEADING = "clamp(30px, 3.5vw, 42px)";

export default function AboutPage() {
  return (
    <>
      <Nav />

      <div className={styles.titleSection}>
        <div className={styles.eyebrow}>FEROZ</div>
        <h1 className={styles.title}>ABOUT US</h1>
      </div>

      <AboutSplitSection
        eyebrow="OUR PURPOSE"
        heading="BUILT TO GO FURTHER."
        headingSize={LARGE_HEADING}
        body="FEROZ exists for people who measure freedom in distance — another ridge, another storm, another limit worth pushing past. We build the equipment that makes that pursuit possible: solid gear, tested in nature."
        photoSrc="/assets/about-img-1.jpg"
        photoAlt="FEROZ climber at sunrise"
        bgSrc="/assets/about-bg-2.jpg"
        topPadding="clamp(24px, 4vw, 40px)"
      />

      <AboutSplitSection
        eyebrow="OUR STORY"
        heading="OUR STORY."
        headingSize={LARGE_HEADING}
        body="FEROZ began on a single trail, with gear that failed exactly when it mattered. We started building our own — prototyping by day, testing it against real mountains, forests and deserts by night. What began as stubbornness became a standard, and a standard became FEROZ."
        photoSrc="/assets/about-img-2.jpg"
        photoAlt="FEROZ hikers at sunset"
        bgSrc="/assets/about-bg-1.jpg"
        reversed
      />

      <AboutSplitSection
        eyebrow="THE FEROZ STANDARD"
        heading="MADE FOR THE UNFORGIVING."
        headingSize={LARGE_HEADING}
        body="Every FEROZ product is judged against one question: will it hold when conditions turn. Durability and practical design come before decoration."
        photoSrc="/assets/about-img-3.jpg"
        photoAlt="FEROZ trail runner in the desert"
        bgSrc="/assets/about-bg-3.jpg"
        tags={["DURABLE", "WEATHER-RESISTANT", "FIELD-TESTED"]}
      />

      <AboutSplitSection
        eyebrow="PARTNERSHIPS"
        heading="TESTED BY THOSE WHO PUSH FURTHER."
        headingSize={SMALL_HEADING}
        body="We work with mountaineers, trail runners and expedition guides who put unfinished gear through conditions most people never see. Their feedback shapes every stitch before a product ever carries the FEROZ name."
        photoSrc="/assets/about-img-4.jpg"
        photoAlt="FEROZ athlete on forest trail"
        bgSrc="/assets/about-bg-4.jpg"
        reversed
        bottomPadding="clamp(80px, 9vw, 120px)"
      />

      <Footer aboutUsAsLink />
    </>
  );
}
