<template>
  <img class="OctanoLogo" alt="Octano" src="~/static/octano.svg" />
</template>

<style>
.OctanoLogo {
  width: 180px;
  transform: rotateY(720deg);
  animation: turn 3.5s ease-out forwards 1s;
}

@keyframes turn {
  100% {
    transform: rotateY(0deg);
  }
}
</style>
