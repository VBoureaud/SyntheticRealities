import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";


function About() {

    const navigate = useNavigate();
    return (
        <>
            <div className="inner-shadow" style={{ maxWidth: '940px', margin: 'auto', paddingBottom: '30px' }}>
                <div style={{ color:'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '15px 0' }}>
                    <h2 style={{ letterSpacing: '1px', margin: 0 }}>About</h2>
                    <button style={{ margin: 0 }} className="button closeBtn" onClick={() => navigate("/")}>Back</button>
                </div>
                <div>
                    <p style={{ color: 'white', textAlign: 'justify' }}>
                    The interplay between AI and the difficulty of discerning truth in digital media has become one of the most pressing issues of our time. As AI technologies advance, they are rapidly transforming how digital content is created, making it increasingly difficult to distinguish between real and synthetic content. This is particularly concerning in a world where misinformation and digital manipulation are becoming widespread, influencing everything from public discourse to personal beliefs.<br /><br />
                    Our interest in this topic stems from a deep concern about how these technologies are transforming the way we consume and trust information. As someone who closely follows developments in AI and its societal impact, we have noted the increasing difficulty distinguishing authentic media from synthetic media. Therefore, we designed an interactive experience allowing players to test their ability to recognize AI-generated content. By creating a game that challenges users to identify increasingly complex synthetic images, we aim to raise awareness and inform our interaction with AI-generated media.<br /><br />
                    Through this project, we seek to better understand human reactions to AI and its implications, and to understand how games can serve as effective platforms for public education. Analyzing trends in player accuracy and response times provides valuable insights into the processes underlying our interactions with digital content, helping us develop strategies to combat misinformation. Ultimately, this work aims to spark conversations about the need for critical media literacy in the age of AI, equipping everyone with the tools they need to navigate a rapidly evolving digital landscape.<br /><br />
                    </p>

                    <a href="https://github.com/VBoureaud/SyntheticRealities">Link to the code</a>
                    <p style={{ marginTop: '35px', color: 'white', textAlign: 'justify' }}>
                    This project is the result of a collaboration between a researcher and a software engineer, combining academic expertise and technical innovation. Dr. Giulio Corsi, who specializes in the intersection of artificial intelligence and digital media, brings a deep understanding of the societal challenges posed by AI-generated content and its impact on human perception and cognition. Meanwhile, Mr. Valentin Boureaud, with a strong background in software solutions, brings practical experience in designing interactive platforms that allow users to interact with emerging technologies. Together, they aim to bridge the gap between theory and application, creating a stimulating tool to explore and raise awareness of the growing challenges of distinguishing between authentic and synthetic media in today's digital landscape.<br /><br />
                    </p>
                </div>
            </div>
            <Footer
                style={{ maxWidth: '940px', margin: 'auto' }}
                gameCount={0}
                linkToHome={() => navigate("/")}
                linkToPlay={() => navigate("/about")}
                LinkToScore={() => navigate("/score")}
                link={'https://gitlab.com/'}
            />
        </>
    )
}

export default About
