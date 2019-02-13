export default {
  methods: {
    pnesColor(pnes) {
      if (pnes) {
        switch (pnes.toLowerCase()) {
          case 'p':
            return '#0DCDAE'
          case 'n':
            return '#4B92F2'
          case 'e':
            return '#F6931A'
          case 's':
            return '#EF4F9B'
          default:
            return '#0DCDAE'
        }
      } else {
        return '#0DCDAE'
      }
    }
  }
}
