export default function Section() {
  return (
    <div class="flex flex-col justify-center items-center min-h-screen bg-gray-100 text-gray-800 text-center p-4">
      <div class="p-8 rounded-lg bg-white shadow-lg max-w-lg">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-24 h-24 mx-auto text-green-500 mb-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
        <h1 class="text-4xl font-bold mb-4 text-gray-900">Estamos Construindo Algo Incrível!</h1>
        <p class="text-xl leading-relaxed">Nosso site está passando por uma grande reforma para oferecer a você a melhor experiência possível. Voltaremos em breve com muitas novidades!</p>
        <p class="text-lg mt-4">Agradecemos a sua paciência.</p>
      </div>
    </div>
  )
}