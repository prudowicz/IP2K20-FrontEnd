<template>
    <div class="myaccount">
        <div class="container">
            <div class="row">
                <div class="col-3">
                    <PasswordChange></PasswordChange>
                </div>
                <div class="col-1"></div>
                <div class="col-3">
                    <XTBChange></XTBChange>
                </div>
                <div class="col-1"></div>
                <div class="col-3">
                    <Info></Info>
                </div>
            </div>
        </div>
    </div>
</template>


<script>

import PasswordChange from './myaccount/PasswordChange.vue'
import XTBChange from './myaccount/XTBChange.vue'
import Info from './myaccount/Info.vue'


export default {
    name: 'MyAccount',
    components: {
        PasswordChange,
        XTBChange,
        Info
    }

}
</script>