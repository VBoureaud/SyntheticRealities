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
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce ornare tincidunt nibh, vel mattis ligula fringilla vitae. Suspendisse sollicitudin, diam ac posuere maximus, turpis magna vulputate urna, eget hendrerit augue ex in est. Phasellus semper mollis nisl, in commodo velit accumsan et. Suspendisse semper ligula quam, id fermentum lectus bibendum non. Nulla commodo ex sem, eu suscipit nisl pulvinar at. Ut vitae scelerisque augue. Quisque dictum quis arcu posuere varius. Ut sagittis enim nec nulla ultricies, sed lacinia justo semper. Nulla ultricies enim ac leo egestas tincidunt. Praesent id laoreet diam. Integer et velit diam. Donec feugiat justo eu augue tempus, sed volutpat nibh semper. Interdum et malesuada fames ac ante ipsum primis in faucibus. Fusce lectus purus, cursus ut molestie id, aliquam quis erat. Curabitur pharetra ac felis sed pharetra. Vestibulum rutrum, metus a tincidunt mattis, enim velit tristique mauris, eu laoreet lacus ligula eget justo.
                        <br /><br />
                        Suspendisse potenti. Phasellus lobortis sodales risus efficitur malesuada. Quisque eget diam tempus, suscipit lectus ac, dignissim libero. Curabitur tempor imperdiet lacus, eget efficitur nisl convallis vitae. Sed tristique eleifend lectus ut placerat. Proin risus neque, eleifend eget consequat nec, hendrerit eu velit. Praesent lobortis dignissim nulla et volutpat. Nulla elit nibh, volutpat non urna at, euismod tristique purus. Praesent egestas eu enim ut iaculis. Aliquam et gravida sapien. Maecenas vestibulum quam sed gravida faucibus.
                        <br /><br />
                        Nam aliquam malesuada nisl, quis accumsan nibh interdum a. Etiam blandit nunc a gravida semper. Etiam dignissim ex ut mi varius malesuada. Morbi malesuada leo nec dictum mollis. Mauris vitae neque a sem cursus scelerisque. Integer consectetur lacinia congue. Curabitur ornare nulla vehicula ipsum commodo, imperdiet rutrum orci auctor. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur facilisis interdum nisi luctus malesuada. In pharetra, purus sed venenatis convallis, ante tellus viverra massa, quis aliquam risus mi at risus. Nunc id feugiat libero. Integer pellentesque sapien neque, non placerat risus sagittis quis. Morbi tempus lacinia turpis sed laoreet. Curabitur convallis nisi sit amet porta iaculis. Curabitur bibendum lacus vel turpis mollis, ac egestas enim lacinia.
                        <br /><br />
                        Morbi vel massa eu magna varius condimentum at quis lacus. Donec vitae justo et dolor ultricies dictum. Cras gravida, enim ut pulvinar iaculis, nisi felis sollicitudin massa, at fringilla metus tellus eget nisi. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Pellentesque bibendum molestie nisl vitae varius. Sed aliquam ante eu condimentum luctus. Nulla nec vehicula nunc, vel ultrices leo. Aenean ligula erat, dignissim vitae arcu eget, sagittis semper lorem. Nulla iaculis mauris nec venenatis elementum. Maecenas sit amet eros odio. Mauris ut nisi scelerisque, aliquet risus et, ultrices augue. Aliquam blandit eros maximus neque ultrices pellentesque. Maecenas congue nisi quis massa eleifend, ac porta sapien convallis. Fusce in libero dui. Nulla vestibulum rutrum elit, ut luctus nulla interdum sit amet. Donec sed urna odio.
                        <br /><br />
                        Nunc dignissim congue sapien, sed ultrices mauris sollicitudin a. Nullam euismod orci ac nisl rhoncus, non facilisis risus lobortis. Nulla pulvinar mauris vitae sem bibendum, sit amet aliquet eros auctor. Sed rutrum vel elit elementum bibendum. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Pellentesque sit amet enim metus. Sed elit dui, mollis non viverra sit amet, accumsan eu augue. 
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
