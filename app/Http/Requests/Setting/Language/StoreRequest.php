<?php

namespace App\Http\Requests\Setting\Language; 

use Illuminate\Support\Str;
use Illuminate\Support\Facades\Lang;
use Illuminate\Foundation\Http\FormRequest; 

class StoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
             'name' => 'required|string|max:255',
             'description' => 'sometimes|string',
             'publish' => 'sometimes|required| in:1,2',
        ];
    } 

    public function attributes()
    {
        return [
            'name' => Lang::get('message.user_catalogue.name'),
            'description' => Lang::get('message.user_catalogue.description'),
        ];
    }
}
