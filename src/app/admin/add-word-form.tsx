'use client';

import {SubmitHandler, useForm} from 'react-hook-form';

export interface AddWordFormInput {
    word: string;
    examples: string;
    definitionEN: string;
    definitionUA: string;
    definitionRU: string;
}

export interface AddWordFormProps {
    onSubmit: SubmitHandler<AddWordFormInput>;
}

export function AddWordForm({onSubmit}: AddWordFormProps) {
    const {register, handleSubmit} = useForm<AddWordFormInput>();

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input
                placeholder="Word"
                {...register('word', {
                    required: true,
                    minLength: 1,
                    maxLength: 20,
                })}
            />
            <input
                placeholder="Examples"
                {...register('examples', {
                    required: true,
                    minLength: 1,
                    maxLength: 20,
                })}
            />
            <input
                placeholder="EN Definition"
                {...register('definitionEN', {
                    required: true,
                    minLength: 1,
                    maxLength: 20,
                })}
            />
            <input
                placeholder="UA Definition"
                {...register('definitionUA', {
                    required: true,
                    minLength: 1,
                    maxLength: 20,
                })}
            />
            <input
                placeholder="RU Definition"
                {...register('definitionRU', {
                    required: true,
                    minLength: 1,
                    maxLength: 20,
                })}
            />
            <input
                type="submit"
                value="Add"
                className="bg-accent hover:bg-amber-500 rounded-sm px-2 py-1 cursor-pointer"
            />
        </form>
    );
}
