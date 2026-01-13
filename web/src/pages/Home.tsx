import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

const Home = () => {
    return (
        <div className="space-y-20">

            {/* HERO SECTION */}
            <section className="text-center py-20 min-h-[60vh] flex flex-col justify-center items-center relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black pointer-events-none"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-rodetes-pink/20 blur-[120px] rounded-full pointer-events-none"></div>

                <h1 className="text-8xl md:text-[10rem] font-bold text-transparent bg-clip-text bg-gradient-to-r from-rodetes-pink to-rodetes-blue mb-4 glitch-hover leading-none relative z-10" data-text="RODETES">
                    RODETES
                </h1>
                <p className="text-2xl md:text-4xl text-white mb-12 font-pixel text-glow-white relative z-10">
                    LA FIESTA DRAG MÁS ICÓNICA
                </p>

                <div className="flex flex-col md:flex-row gap-6 relative z-10">
                    <Link to="/events">
                        <Button size="lg" className="bg-white text-black hover:bg-rodetes-pink hover:text-white border-none w-64">
                            PRÓXIMOS EVENTOS
                        </Button>
                    </Link>
                    <Link to="/merch">
                        <Button size="lg" variant="outline" className="w-64 border-rodetes-blue text-rodetes-blue hover:bg-rodetes-blue hover:text-black">
                            TIENDA OFICIAL
                        </Button>
                    </Link>
                </div>
            </section>

            {/* FEATURED SECTIONS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center border-t border-gray-800 pt-12">
                <div className="p-8 hover:bg-gray-900 transition-colors border border-transparent hover:border-gray-700">
                    <h3 className="text-3xl font-pixel text-rodetes-pink mb-4">DRAGS</h3>
                    <p className="text-gray-400 mb-6">Conoce a nuestro elenco residente e invitadas especiales.</p>
                    <Link to="/drags" className="text-white hover:text-rodetes-pink underline">VER TODAS</Link>
                </div>
                <div className="p-8 hover:bg-gray-900 transition-colors border border-transparent hover:border-gray-700">
                    <h3 className="text-3xl font-pixel text-rodetes-blue mb-4">MÚSICA</h3>
                    <p className="text-gray-400 mb-6">Pop, House y los mejores hits para no parar de bailar.</p>
                    <Link to="/gallery" className="text-white hover:text-rodetes-blue underline">VER GALERÍA</Link>
                </div>
                <div className="p-8 hover:bg-gray-900 transition-colors border border-transparent hover:border-gray-700">
                    <h3 className="text-3xl font-pixel text-white mb-4">MERCH</h3>
                    <p className="text-gray-400 mb-6">Apoya el arte local y llévate un recuerdo a casa.</p>
                    <Link to="/merch" className="text-white hover:text-gray-300 underline">IR A LA TIENDA</Link>
                </div>
            </div>
        </div>
    );
};

export default Home;
