import { sections } from '@/lib/scroll-sections';
import { useScroll } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { easing } from 'maath';
import { Vector3, Euler, Group, MathUtils } from 'three';

const targetPos = new Vector3();
const targetLookAt = new Vector3();
const targetRot = new Euler();

export default function CameraController() {
  const scroll = useScroll(); // Pega os dados de scroll

  useFrame((state, delta) => {
    // 1. Encontrar a seção atual e a próxima
    const scrollOffset = scroll.offset;

    // Encontra a última seção cujo início é ANTES do scroll atual
    let currentSectionIndex = sections.findIndex(
      (s, i) =>
        i === sections.length - 1 || // Se for a última seção
        (scrollOffset >= s.start && scrollOffset < sections[i + 1].start)
    );
    if (currentSectionIndex === -1) currentSectionIndex = 0; // Fallback

    const currentSection = sections[currentSectionIndex];

    // 2. Calcular o progresso e interpolar (se não for a última seção)
    let targetFov = currentSection.cameraFov;
    targetPos.copy(currentSection.cameraPosition);
    targetLookAt.copy(currentSection.cameraTarget);
    targetRot.copy(currentSection.diamondRotation);

    const smoothTime = currentSection.transitionSpeed; // Duração da animação

    if (currentSectionIndex < sections.length - 1) {
      const nextSection = sections[currentSectionIndex + 1];

      // Calcula o progresso (0-1) DENTRO da seção atual
      const progress =
        (scrollOffset - currentSection.start) /
        (nextSection.start - currentSection.start);

      // 3. Interpola os valores alvo
      targetPos.lerpVectors(
        currentSection.cameraPosition,
        nextSection.cameraPosition,
        progress
      );
      targetLookAt.lerpVectors(
        currentSection.cameraTarget,
        nextSection.cameraTarget,
        progress
      );
      targetFov = MathUtils.lerp(
        currentSection.cameraFov,
        nextSection.cameraFov,
        progress
      );

      // Interpolação de Euler (rotação)
    //   const currentRotVec = currentSection.diamondRotation.toVector3();
    //   const nextRotVec = nextSection.diamondRotation.toVector3();
    //   targetRot.setFromVector3(currentRotVec.lerp(nextRotVec, progress));
    }

    // 4. Aplicar o DAMP (suavização) aos alvos
    // Anima a Câmera
    easing.damp3(state.camera.position, targetPos, smoothTime, delta);

    // Anima o Ponto de "LookAt" (para onde a câmera olha)
    // Usamos um truque: animamos um Vector3 e depois o usamos
    easing.damp3(
      state.camera.userData.dampedLookAt || // Cria um vetor se não existir
        (state.camera.userData.dampedLookAt = new Vector3()),
      targetLookAt,
      smoothTime,
      delta
    );
    state.camera.lookAt(state.camera.userData.dampedLookAt);

    // Anima o FOV (zoom)
    easing.damp(state.camera, 'fov' as any, targetFov, smoothTime, delta);
    state.camera.updateProjectionMatrix(); // Necessário ao mudar o FOV

    // Anima o Diamante (se a ref existir)
    // if (diamondRef.current) {
    //   easing.dampE(diamondRef.current.rotation, targetRot, smoothTime, delta);
    // }
  });

  return null;
}
