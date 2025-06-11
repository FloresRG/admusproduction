<?php
    namespace App\Models;
    use Illuminate\Database\Eloquent\Model;

    class TipoUser extends Model
    {
        protected $table = 'tipo_user';

        public $timestamps = false; // ya que la tabla no tiene created_at ni updated_at

        protected $fillable = [
            'user_id',
            'tipo_id',
        ];

        // Relaciones (opcional)
        public function user()
        {
            return $this->belongsTo(User::class);
        }

        public function tipo()
        {
            return $this->belongsTo(Tipo::class);
        }
    }
