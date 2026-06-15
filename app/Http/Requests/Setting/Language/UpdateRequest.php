<?php

namespace App\Http\Requests\Setting\Language; 

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Lang;
use Illuminate\Validation\Rule;

class UpdateRequest extends FormRequest
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
     * Rule::unique('user_catalogues')->ignore($this->route('user_catalogue')),
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $method = $this->getMethod();
        $sometimes = $method === "PATCH" ? "sometimes" : "";

        return [
            'name' => [$sometimes, 'required', 'string', 'max:255'],
            'description' => 'sometimes|string', 
            'publish' => 'sometimes|in:1,2'
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
