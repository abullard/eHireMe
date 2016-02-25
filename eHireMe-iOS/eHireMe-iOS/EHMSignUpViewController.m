//
//  EHMSignUpViewController.m
//  eHireMe-iOS
//
//  Created by Mac Liu on 2/23/16.
//  Copyright © 2016 eHireMe. All rights reserved.
//

#import "EHMSignUpViewController.h"

#import <AFNetworking.h>
#import "EHMConstants.h"

@interface EHMSignUpViewController ()

@end

@implementation EHMSignUpViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
    self.view.backgroundColor = [UIColor colorWithPatternImage:[UIImage imageNamed:@"create-account"]];

}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

#pragma mark - IBActions

- (IBAction)exitButtonPressed:(UIButton *)sender {
    [self dismissViewControllerAnimated:NO completion:nil];
}

- (IBAction)signUpButtonPressed:(UIButton *)sender {
    NSString *email = self.emailTextField.text;
    NSString *name = self.nameTextField.text;
    NSString *password = self.passwordTextField.text;
    NSString *confirmPassword = self.confirmPasswordTextField.text;
    
    //If any of the fields are empty, alert then return to prevent further execution.
    if (email.length == 0 || password.length == 0 || name.length == 0) {
        UIAlertController *alertController = [UIAlertController alertControllerWithTitle:@"Hey!" message:@"Fill out the form plz.." preferredStyle:UIAlertControllerStyleAlert];
        UIAlertAction* ok = [UIAlertAction actionWithTitle:@"OK" style:UIAlertActionStyleDefault handler:nil];
        [alertController addAction:ok];
        [self presentViewController:alertController animated:YES completion:nil];
        
        return;
    }
    
    //Password and confirmation password did not match
    if (![password isEqualToString:confirmPassword]) {
        UIAlertController *alertController = [UIAlertController alertControllerWithTitle:@"Sign up failed" message:@"Passwords did not match." preferredStyle:UIAlertControllerStyleAlert];
        UIAlertAction* ok = [UIAlertAction actionWithTitle:@"OK" style:UIAlertActionStyleDefault handler:nil];
        [alertController addAction:ok];
        [self presentViewController:alertController animated:YES completion:nil];
        
        return;
    }
    
    NSDictionary *newUser = @{@"email" : email,
                              @"dob" : @"",
                              @"age" : [NSNumber numberWithInt:-1],
                              @"state" : @"",
                              @"city" : @"",
                              @"bio" : @"",
                              @"password" : password,
                              @"name" : name};
    
    NSString *urlStr = [NSString stringWithFormat:@"%@/applicants/register", baseURL];
    
    AFHTTPSessionManager *manager = [[AFHTTPSessionManager alloc]initWithSessionConfiguration:[NSURLSessionConfiguration defaultSessionConfiguration]];
    manager.requestSerializer = [AFJSONRequestSerializer serializer];
    
    [manager.requestSerializer setValue:@"application/json" forHTTPHeaderField:@"Content-Type"];
    
    [manager POST:urlStr parameters:newUser progress:nil success:^(NSURLSessionDataTask * _Nonnull task, id  _Nullable responseObject) {
        NSLog(@"%@", responseObject);
        
        if (responseObject != nil) {
            NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
            [defaults setObject:[responseObject objectForKey:@"id"] forKey:@"EHMUser_ID"];
            [defaults setObject:[responseObject objectForKey:@"email"] forKey:@"EHMUser_Email"];
            [defaults synchronize];
            
            [self performSegueWithIdentifier:@"ToSwipeView" sender:self];
        } else {
            NSLog(@"Error invalid info");
            UIAlertController *alertController = [UIAlertController alertControllerWithTitle:@"Sign up failed" message:@"Please make sure content is correct." preferredStyle:UIAlertControllerStyleAlert];
            UIAlertAction* ok = [UIAlertAction actionWithTitle:@"OK" style:UIAlertActionStyleDefault handler:nil];
            [alertController addAction:ok];
            [self presentViewController:alertController animated:YES completion:nil];
        }
        
        
    } failure:^(NSURLSessionDataTask * _Nullable task, NSError * _Nonnull error) {
        NSLog(@"error: %@", error);
    }];
}

/*
#pragma mark - Navigation

// In a storyboard-based application, you will often want to do a little preparation before navigation
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
    // Get the new view controller using [segue destinationViewController].
    // Pass the selected object to the new view controller.
}
*/

@end
