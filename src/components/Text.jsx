import { useModal, FIELD_PRESETS } from "../context/ModalContext";

export default function TrylleLanding() {
  const { openModal } = useModal();
  return (
    <div className="min-h-screen bg-[#F9F3FA] text-white flex flex-col items-center justify-center px-4 text-center">

      <h1 className="text-3xl text-black md:text-5xl font-bold mb-6">
        Turn browsers into buyers with Vizzle
      </h1>

      <p className="text-black max-w-3xl text-lg leading-relaxed">
        Vizzle partners with leading fashion brands and retailers, integrating seamlessly into your online store so shoppers see your collections come to life, discover looks they’ll love, and shop with confidence.
      </p>

      <p className="text-black mt-10 text-xl font-semibold">
        We’re now inviting  brands to join our launch. Register today!
      </p>

      {/* Updated Button */}
      <button 
        onClick={() => openModal('Request Brand Access', FIELD_PRESETS.all)}
        className="mt-6 bg-[#1D8DB2] hover:bg-cyan-300 text-white px-8 py-3 rounded-xl text-lg font-semibold transition"
      >
        Request Brand Access
      </button>

    </div>
  );
}
