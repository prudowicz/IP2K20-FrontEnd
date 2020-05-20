<template>
    <div>
        <div class="card" style="width: 18rem;">
         <div class="card-body">
        <form>
          <div class="form-group">
            <label for="xtblogin">New XTB Login</label>
            <input type="login" class="form-control" id="xtblogin" placeholder="Enter login">
        </div>
          <div class="form-group">
            <label for="password">New XTB Password</label>
            <input type="password" class="form-control" id="password" placeholder="Password">
          </div>
          <button type="submit" class="btn btn-primary">Submit</button>
        </form>
        </div>
        </div>
    </div>
</template>


<script>
export default {
  name: 'XTBChange',
  props: {
    msg: String
  }
}
</script>