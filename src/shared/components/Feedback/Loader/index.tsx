import { IconProps } from '@shared/components'
import { SFC } from '@shared/types'
import './styles.css'
type LoaderProps = Pick<IconProps, 'size'>

export const Loader: SFC<LoaderProps> = () => {
  return (
<div className={("w-screen flex-col gap-5 flex items-center relative justify-center h-screen bg-primary") }>
<svg viewBox="0 0 500 500" className='w-[60vh] h-[60vh]' >
  <g className="arm">
    <line className="segment" x1="250" y1="250" x2="300" y2="250"></line>
    <circle className="joint" cx="250" cy="250" r="64"></circle>
    <g className="arm1">
      <line className="segment" x1="300" y1="250" x2="400" y2="250"></line>
      <circle className="joint" cx="300" cy="250" r="30"></circle>
      <g className="arm2">
        <line className="segment" x1="400" y1="250" x2="490" y2="250"></line>
        <circle className="joint" cx="400" cy="250" r="24"></circle>
        <g className="arm3">
          <line className="segment" x1="490" y1="250" x2="550" y2="250"></line>
          <circle className="joint" cx="490" cy="250" r="16"></circle>
        </g>
      </g>
      <g className="arm1">
        <line className="segment" x1="300" y1="250" x2="400" y2="250"></line>
        <circle className="joint" cx="300" cy="250" r="30"></circle>
        <g className="arm2">
          <line className="segment" x1="400" y1="250" x2="490" y2="250"></line>
          <circle className="joint" cx="400" cy="250" r="8"></circle>
          <g className="arm3">
            <line className="segment" x1="490" y1="250" x2="550" y2="250"></line>
            <circle className="joint" cx="490" cy="250" r="8"></circle>
          </g>
          <g className="arm2">
            <line className="segment" x1="400" y1="250" x2="490" y2="250"></line>
            <circle className="joint" cx="400" cy="250" r="8"></circle>
            <g className="arm3">
              <line className="segment" x1="490" y1="250" x2="550" y2="250"></line>
              <circle className="joint" cx="490" cy="250" r="8"></circle>
            </g>
          </g>
        </g>
      </g>
    </g>
  </g>
  <g id="mir" className="arm">
    <line className="segment" x1="250" y1="250" x2="300" y2="250"></line>
    <circle className="joint" cx="250" cy="250" r="64"></circle>
    <g className="arm1">
      <line className="segment" x1="300" y1="250" x2="400" y2="250"></line>
      <circle className="joint" cx="300" cy="250" r="30"></circle>
      <g className="arm2">
        <line className="segment" x1="400" y1="250" x2="490" y2="250"></line>
        <circle className="joint" cx="400" cy="250" r="24"></circle>
        <g className="arm3">
          <line className="segment" x1="490" y1="250" x2="550" y2="250"></line>
          <circle className="joint" cx="490" cy="250" r="16"></circle>
        </g>
      </g>
      <g className="arm1">
        <line className="segment" x1="300" y1="250" x2="400" y2="250"></line>
        <circle className="joint" cx="300" cy="250" r="30"></circle>
        <g className="arm2">
          <line className="segment" x1="400" y1="250" x2="490" y2="250"></line>
          <circle className="joint" cx="400" cy="250" r="8"></circle>
          <g className="arm3">
            <line className="segment" x1="490" y1="250" x2="550" y2="250"></line>
            <circle className="joint" cx="490" cy="250" r="8"></circle>
          </g>
          <g className="arm2">
            <line className="segment" x1="400" y1="250" x2="490" y2="250"></line>
            <circle className="joint" cx="400" cy="250" r="8"></circle>
            <g className="arm3">
              <line className="segment" x1="490" y1="250" x2="550" y2="250"></line>
              <circle className="joint" cx="490" cy="250" r="8"></circle>
            </g>
          </g>
        </g>
      </g>
    </g>
  </g>
    <filter id="metaball">
      <feGaussianBlur
        in="SourceGraphic"
        stdDeviation="17"
        result="blur"
      ></feGaussianBlur>
      <feColorMatrix
        in="blur"
        mode="matrix"
        values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 100 -7"
        result="fluid"
      ></feColorMatrix>
      <feComposite in="SourceGraphic" in2="fluid" operator="atop"></feComposite>
    </filter>
  
  </svg>
  <div className="w-fit absolute top-[60vh] text-slate-100">
    <span className="text-lg">NUTSHELL your Agentic POS</span>
  </div>
  </div>
  )
}
