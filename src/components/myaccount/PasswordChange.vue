<template>
    <div>
      <div class="card" style="width: 18rem;">
         <div class="card-body">
        <form>
          <div class="form-group">
            <label for="pasword1">Actual password</label>
            <input type="password" class="form-control" id="pasword1" placeholder="Password">
          </div>
          <div class="form-group">
            <label for="password2">New password</label>
            <input type="password" class="form-control" id="password2" placeholder="Password">
          </div>
          <div class="form-group">
            <label for="password3">Repeat new password</label>
            <input type="password" class="form-control" id="password3" placeholder="Password">
          </div>
          <button type="submit" class="btn btn-primary">Submit</button>
        </form>
         </div>
      </div>
    </div>
</template>


<script>
export default {
  name: 'PasswordChange',
  props: {
    msg: String
  }
}
</script>