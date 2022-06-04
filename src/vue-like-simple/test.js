import { App } from "./app";

const vm = new App( {
  render() {
    const { title, userInfo, num } = this
    return `
    <div>
      <h2>title: ${ title } times ${ num }</h2>
      <p>userName: ${ userInfo.name }</p>
      <p>phone: ${ userInfo.phone }</p>
      <p>age: ${ userInfo.age }</p>
      <button id="add-times">add</button>
      <button id="reduce-times">reduce</button>
      <button id="add-age">add age</button>
    </div> 
    `;
  },
  data: () => ({
    title: 'test',
    num: 0,
    userInfo: {
      name: "Hu Kun",
      age: 10,
      phone: '17665233936'
    }
  }),
  beforeCreate() {
    console.log( "beforeCreate" )
  },
  created() {
    console.log( "created" )
  },
  beforeMount() {
    console.log( "beforeMount" )
  },
  mounted() {
    this.mountTestEvent()
    console.log( "mounted" )
  },
  beforeUpdate() {
    console.log( "beforeUpdate" )
  },
  updated() {
    this.mountTestEvent()
    console.log( "updated" )
  },
  beforeDestroy() {
    console.log( "beforeDestroy" )
  },
  method: {
    mountTestEvent() {
      const that = this;
      document.getElementById( "add-times" ).onclick = function () {
        console.log("call add times")
        that.addTimes()
      }
      document.getElementById( "reduce-times" ).onclick = function () {
        that.reduceTimes()
      }
      document.getElementById( "add-age" ).onclick = function () {
        that.addAge()
      }
    },
    addTimes() {
      this.num += 1;
    },
    addAge() {
      this.userInfo.age++
    },
    reduceTimes() {
      this.num -= 1
    }
  }
} )

