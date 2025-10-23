import Skeleton, { SkeletonProps } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export default function MySkeleton(props: SkeletonProps) {
  return <Skeleton baseColor='#000000' highlightColor='#131313' {...props}/>
}
