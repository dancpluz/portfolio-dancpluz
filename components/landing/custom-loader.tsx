'use client';

import { useProgress } from '@react-three/drei';
import { motion } from 'motion/react';

export function CustomLoader() {
  // 1. O hook 'useProgress' nos dá o status do carregamento
  const { progress, active } = useProgress();

  return (
    // 2. Usamos 'motion.div' para animar o fade-out
    <motion.div
      // Anima a opacidade de 1 (se 'active' for true) para 0 (se 'active' for false)
      animate={{
        opacity: active ? 1 : 0,
      }}
      transition={{
        duration: 0.5,
        delay: active ? 0 : 0.8, // Adiciona um pequeno delay antes de desaparecer
      }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(8, 8, 8, 0.9)', // Seu --color-background
        color: 'white',
        zIndex: 100, // Garante que fique por cima de tudo
        // 3. Permite que cliques "passem" pelo loader quando ele estiver invisível
        pointerEvents: active ? 'auto' : 'none',
      }}
    >
      {/* 4. O texto da porcentagem (arredondado) */}
      <div style={{ fontSize: '1.5em', fontWeight: 'bold' }}>
        {Math.round(progress)}%
      </div>

      {/* 5. A barra de progresso customizada */}
      <div
        style={{
          width: '200px',
          height: '5px',
          backgroundColor: '#555', // Fundo da barra
          marginTop: '10px',
          borderRadius: '2px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${progress}%`, // Largura dinâmica baseada no progresso
            height: '100%',
            backgroundColor: '#eca400', // Sua --color-accent
            transition: 'width 0.3s ease-out', // Suaviza o preenchimento
          }}
        />
      </div>
    </motion.div>
  );
}
