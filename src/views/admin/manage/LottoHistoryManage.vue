<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <v-form fast-fail ref="isValid">
                    <v-row align="center">
                        <v-col cols="2" class="text-right">
                            <v-text-field 
                                v-model="round" 
                                label="회차 입력"
                                :rules="lottoRoundRule"
                                outlined/>
                        </v-col>
                        <v-col cols="6" class="text-left">
                            <v-btn 
                                color="primary" 
                                @click="addLottoHistory"
                                text="해당 회차 당첨 번호 저장"/>
                        </v-col>
                    </v-row>
                </v-form>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <v-data-table-server
                    v-model:items-per-page="pageSize"
                    :headers="tableHeader"
                    :items-length="totalCount"
                    :items="extractions"
                    :loading="isLoading"
                    :page.sync="currentPage"
                    item-key="id"
                    @update:options="getWinnings"
                    class="elevation-1"
                >
                    <template v-slot:no-data>
                        <v-alert :value="true" icon="mdi-alert">아직 당첨 번호 기록이 없습니다.</v-alert>
                    </template>
                </v-data-table-server>
                <v-row class="text-center px-4 align-center" wrap>
                    <v-col>
                        <v-pagination
                            v-model="currentPage"
                            :length="getPageCount"
                        />
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
    </v-container>

</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { read, write } from "@/utils/util-axios";
import { convertDateOnlyDay } from "@/utils/util-dateConverter";
import { useRoute, useRouter } from "vue-router";


const route = useRoute();
const router = useRouter();
const isLoading = ref(false);
const currentPage = ref(1);
const totalCount = ref(0);
const pageSize = ref(10);
const extractions = ref([]);
const round = ref(0);
const isValid = ref(null);

const lottoRoundRule = [
  v => /^\d+$/.test(v) || '숫자만 입력하세요',
  v => parseInt(v) > 0 || '0보다 큰 숫자를 입력하세요'
]
const tableHeader = [
    { title: '회차', align: 'center', value: "round" },
    { title: '1st', align: 'center', value: 'firstNumber' },
    { title: '2nd', align: 'center', value: 'secondNumber' },
    { title: '3rd', align: 'center', value: 'thirdNumber' },
    { title: '4th', align: 'center', value: 'fourthNumber' },
    { title: '5th', align: 'center', value: 'fifthNumber' },
    { title: '6th', align: 'center', value: "sixthNumber" },
    { title: 'bonus', align: 'center', value: "bonusNumber" },
    { title: '추첨날짜', align: 'center', value: "drawDate" }
]

const addLottoHistory = async() => {
    const {valid} = await isValid.value.validate();
    try {
        if (valid) {
            await write(`/api/admin/lotto/winning/${round.value}`);
            alert(`${round.value} 회차의 당첨번호가 정상적으로 저장되었습니다.`);
            getWinnings();
        } else alert("회차는 0보다 큰 숫자로만 입력바랍니다.");
    } catch(e) {
        alert(e.message);
    }
}

const getWinnings = async() => {
    isLoading.value = true;
    try {
        const response = await read("/api/lotto/winnings", {
            page: currentPage.value - 1,
            size: pageSize.value
        });
        isLoading.value = false;
        extractions.value = response.data.data.list;
        totalCount.value = response.data.data.totalCount;
    } catch(e) {
        isLoading.value = false;
        alert(e.message);
    }
}

const getPageCount = computed(() => {
    return Math.floor(((totalCount.value-1) / pageSize.value) + 1);
});

onMounted(getWinnings);

</script>

<style scoped>
</style>
