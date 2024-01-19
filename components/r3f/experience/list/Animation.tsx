import { ExperienceViewProps } from '@r3f/experience'
import { a, useSpring } from '@react-spring/three'
import { ReactThreeFiber, useFrame, useThree } from '@react-three/fiber'
import { useDrag } from '@use-gesture/react'
import { useActive } from 'hooks/r3f/useActive'
import React, { useRef } from 'react'
import { useApplicationStore } from 'store'

export const Animation: React.FC<ExperienceViewProps> = ({
	experienceTrack
}) => {
	const mesh = useRef<THREE.Mesh>(null!)
	const group = useRef<THREE.Group>(null!)

	const { animatingPosition } = useActive('animation')

	useFrame((_, delta) => {
		mesh.current.rotation.x += delta * 0.3
		mesh.current.rotation.y += delta * 0.3
	})

	const setViewingExperience = useApplicationStore(
		state => state.setViewingExperience
	)
	const viewingExperience = useApplicationStore(
		state => state.viewingExperience
	)

	const size = useThree(state => state.size)

	const [{ groupPositionX, groupScale }, groupPositionApi] = useSpring(() => ({
		groupPositionX: [4, 0, 0] as ReactThreeFiber.Vector3,
		groupScale: [1, 1, 1]
	}))

	useDrag(
		({ movement: [mx], active, delta: [dx] }) => {
			if (viewingExperience === 'animation') {
				if (active) {
					groupPositionApi.start({
						groupPositionX: [(mx / size.width) * 5 + 4, 0, 0],
						groupScale: [0.8, 0.8, 0.8]
					})
				} else {
					groupPositionApi.start({
						groupPositionX: [4, 0, 0],
						groupScale: [1, 1, 1]
					})
					if (Math.abs(mx) > size.width / 4) {
						mx < 0 && setViewingExperience('modeling')
						mx > 0 && setViewingExperience('reactjs')
					}
				}
			}
		},
		{
			target: document.getElementById('ex-track')!
		}
	)

	return (
		<a.group
			// prettier-ignore
			ref={group}
			// @ts-ignore
			position={groupPositionX}
			// @ts-ignore
			scale={groupScale}
		>
			<a.mesh
				ref={mesh}
				scale={0.5}
				// @ts-ignore
				position={animatingPosition}
			>
				<icosahedronGeometry />
				<meshBasicMaterial color={'white'} />
			</a.mesh>

			<ambientLight />
		</a.group>
	)
}
