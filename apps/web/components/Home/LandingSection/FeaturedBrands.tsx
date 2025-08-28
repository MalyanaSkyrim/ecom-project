'client'

import Calvin from '../../../public/svg/calvin.svg'
import Gucci from '../../../public/svg/gucci.svg'
import Prada from '../../../public/svg/prada.svg'
import Versace from '../../../public/svg/versace.svg'
import Zara from '../../../public/svg/zara.svg'

const brandsLogos = [Versace, Zara, Gucci, Prada, Calvin]

const FeaturedBrands = () => {
  return (
    <div className="absolute bottom-0 left-0 w-full bg-black">
      {/* Mobile and iPad: 3 above 2 layout */}
      <div className="lg:hidden">
        {/* First row - 3 logos */}
        <div className="flex h-[40px] items-center justify-center md:h-[61px]">
          {brandsLogos.slice(0, 3).map((Logo, index) => (
            <div
              key={index}
              className="flex flex-1 items-center justify-center">
              <Logo className="2xs:h-[20px] h-[15px] w-auto text-white md:h-[30px]" />
            </div>
          ))}
        </div>
        {/* Second row - 2 logos */}
        <div className="flex h-[40px] items-center justify-center md:h-[61px]">
          {brandsLogos.slice(3, 5).map((Logo, index) => (
            <div
              key={index + 3}
              className="flex max-w-[50%] flex-1 items-center justify-center">
              <Logo className="2xs:h-[20px] h-[15px] w-auto text-white md:h-[30px]" />
            </div>
          ))}
        </div>
      </div>

      {/* Desktop: All 5 in one row */}
      <div className="hidden h-[122px] items-center justify-around lg:flex">
        {brandsLogos.map((Logo, index) => (
          <Logo key={index} className="w-auto text-white md:h-[30px]" />
        ))}
      </div>
    </div>
  )
}

export default FeaturedBrands
