<template>
  <div>
    <ul>
      <li></li>
    </ul>
    <span>{{$t('nav.maintenance')}}</span>
    <p>{{$t(i18n)}}</p>
    <p @click="onChangeLang">{{$t('config.autoLangbut')}}</p>
  </div>
</template>

<script>
export default {
  name: "",

  data() {
    return {
      langType: [],
      i18n: "nav.device"
    };
  },
  created() {
    console.log("国际化", this.$t("nav.maintenance"));
  },
  methods: {
    onChangeLang() {
      let lang = this.$i18n.locale;

      if (lang === "zh") {
        this.$i18n.locale = "en";
        sessionStorage.setItem("lang", "en");
      } else {
        this.$i18n.locale = "zh";
        sessionStorage.setItem("lang", "zh");
      }
    }
  }
};
</script>

<style lang='stylus' rel='stylesheet/stylus'></style>
