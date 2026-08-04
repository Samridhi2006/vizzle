/* eslint-disable react/no-unescaped-entities */
function About() {
  return (
    <section className="w-full bg-[#70BBD4C9]">
      {/* ABOUT */}
      <div className="container max-w-screen-lg mx-auto py-12 px-6 flex flex-col items-center justify-around gap-12 sm:py-20 sm:flex-row">
        <img
          src="about.png"
          alt="About Vizzle"
          className="max-w-80 rounded-lg shadow-lg "
        />
        <div>
          <h1 className="text-4xl text-center font-medium mb-4 sm:text-left">
            About Vizzle
          </h1>
          <p className="w-full text-justify tracking-wider text- px-4 pb-4 font-medium leading-7 text-[#3A3A3A] sm:px-0 sm:text-left">
            Vizzle is a cutting edge fashion technology startup that
            revolutionizes the way you experience style. By harnessing the power
            of augmented reality, Vizzle transforms your clothing choices into
            immersive, interactive visual experiences. Whether you're exploring
            new outfits or curating your personal wardrobe, Vizzle brings a
            futuristic twist to fashion by letting you see, try on, and mix and
            match styles in real time. With a keen focus on blending aesthetics
            and innovation.
          </p>
        </div>
      </div>
    </section>
  );
}

export default About;
